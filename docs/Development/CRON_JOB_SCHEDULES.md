# Cron Job Schedules

## 1. Vercel Cron Configuration

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/reconcile",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/escrow-release",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/cleanup-locks",
      "schedule": "*/10 * * * *"
    },
    {
      "path": "/api/cron/analytics-aggregate",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/sms-reminder",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

## 2. Reconciliation (Payment Cleanup)

**Path:** `/api/cron/reconcile`  
**Schedule:** Every 5 minutes (`*/5 * * * *`)  
**Purpose:** Clean up failed/expired payments

```typescript
// src/app/api/cron/reconcile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Find pending bookings > 10 minutes old
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
  const expiredBookings = await db.booking.findMany({
    where: {
      status: 'pending',
      createdAt: { lt: tenMinutesAgo },
    },
    select: { id: true, providerId: true, slotStart: true },
  });
  
  const results = [];
  
  for (const booking of expiredBookings) {
    // Release Redis lock
    const lockKey = `lock:${booking.providerId}:${booking.slotStart.toISOString()}`;
    await redis.del(lockKey);
    
    // Mark as cancelled
    await db.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    });
    
    results.push({ bookingId: booking.id, action: 'cancelled' });
  }
  
  return NextResponse.json({ 
    processed: results.length,
    details: results 
  });
}
```

## 3. Escrow Release

**Path:** `/api/cron/escrow-release`  
**Schedule:** Every 15 minutes (`*/15 * * * *`)  
**Purpose:** Release funds after 4-hour dispute window

```typescript
// src/app/api/cron/escrow-release/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Find confirmed bookings where slotEnd was > 4 hours ago
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  
  const eligibleBookings = await db.booking.findMany({
    where: {
      status: 'confirmed',
      slotEnd: { lt: fourHoursAgo },
    },
    include: {
      provider: { include: { user: true } },
      service: true,
    },
  });
  
  const results = [];
  
  for (const booking of eligibleBookings) {
    // Check if there's an active dispute
    const hasDispute = await db.report.findFirst({
      where: { bookingId: booking.id },
    });
    
    if (hasDispute) {
      results.push({ bookingId: booking.id, action: 'skipped', reason: 'disputed' });
      continue;
    }
    
    // Calculate tutor earnings (amount - platformFee)
    const tutorEarnings = booking.amount - booking.platformFee;
    
    // Update booking status
    await db.booking.update({
      where: { id: booking.id },
      data: { status: 'completed' },
    });
    
    // Add to tutor wallet
    await db.user.update({
      where: { id: booking.provider.userId },
      data: { walletBalance: { increment: tutorEarnings } },
    });
    
    // Increment tutor's completed sessions
    await db.provider.update({
      where: { id: booking.providerId },
      data: { completedSessions: { increment: 1 } },
    });
    
    results.push({ 
      bookingId: booking.id, 
      action: 'released', 
      amount: tutorEarnings 
    });
  }
  
  return NextResponse.json({ 
    processed: results.length,
    details: results 
  });
}
```

## 4. Lock Cleanup

**Path:** `/api/cron/cleanup-locks`  
**Schedule:** Every 10 minutes (`*/10 * * * *`)  
**Purpose:** Remove stale Redis locks

```typescript
// Delete all lock keys older than 5 minutes (TTL auto-expires but cleanup stuck keys)
const keys = await redis.keys('lock:*');
for (const key of keys) {
  const ttl = await redis.ttl(key);
  if (ttl === -1) {
    // Key exists but has no TTL - force delete
    await redis.del(key);
  }
}
```

## 5. SMS Reminders

**Path:** `/api/cron/sms-reminder`  
**Schedule:** Every 30 minutes (`*/30 * * * *`)  
**Purpose:** Send 60m and 15m reminders

```typescript
// Send 60-minute reminder
const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
const bookingsInOneHour = await db.booking.findMany({
  where: {
    status: 'confirmed',
    slotStart: {
      gte: new Date(oneHourFromNow.getTime() - 5 * 60 * 1000),
      lt: oneHourFromNow,
    },
  },
  include: { provider: { include: { user: true } }, client: true },
});

// Send reminders via sendSms()
```

## 6. Dashboard: View Cron Jobs

In Admin Dashboard, show cron job status:

| Job | Schedule | Last Run | Status | Records Processed |
|-----|----------|----------|--------|-------------------|
| reconcile | */5 * * * * | 2 mins ago | ✅ | 3 |
| escrow-release | */15 * * * * | 8 mins ago | ✅ | 12 |
| cleanup-locks | */10 * * * * | 3 mins ago | ✅ | 0 |
| sms-reminder | */30 * * * * | 15 mins ago | ✅ | 8 |

---

## QA Check - Fixes Applied:
- ✅ 4-hour escrow window matches ENGINE_LOGIC.md
- ✅ 10-minute payment cleanup (per PAYMENT_FLOW_RECONCILIATION.md)
- ✅ SMS reminder schedule (per NOTIFICATION_LIFECYCLE.md)
- ✅ Cron secrets for security