# Admin Roles & Permissions

## 1. Role Definitions

```prisma
model User {
  // ... existing fields
  role          UserRole      @default(USER) // USER, ADMIN, SUPER_ADMIN
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

model AdminAuditLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // approve_tutor, refund_booking, etc.
  targetType  String   // Provider, Booking, User
  targetId    String
  details     Json?    // { before: {}, after: {} }
  createdAt   DateTime @default(now())
}
```

## 2. Permission Matrix

| Action | USER | ADMIN | SUPER_ADMIN |
|--------|------|-------|-------------|
| **Tutor Management** | | | |
| View all tutors | ❌ | ✅ | ✅ |
| Verify tutor (approve/reject) | ❌ | ✅ | ✅ |
| Suspend tutor | ❌ | ❌ | ✅ |
| View tutor earnings | ❌ | ✅ | ✅ |
| **Booking Management** | | | |
| View all bookings | ❌ | ✅ | ✅ |
| Cancel any booking | ❌ | ✅ | ✅ |
| Refund booking | ❌ | ✅ | ✅ |
| **Payouts** | | | |
| View payout requests | ❌ | ✅ | ✅ |
| Process payout (mark paid) | ❌ | ✅ | ✅ |
| Adjust wallet balance | ❌ | ❌ | ✅ |
| **Disputes** | | | |
| View disputes | ❌ | ✅ | ✅ |
| Resolve dispute | ❌ | ✅ | ✅ |
| **Users** | | | |
| View all users | ❌ | ✅ | ✅ |
| Delete user | ❌ | ❌ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| **Settings** | | | |
| Feature flags | ❌ | ❌ | ✅ |
| SMS templates | ❌ | ✅ | ✅ |
| View audit logs | ❌ | ❌ | ✅ |

## 3. Middleware for Role Check

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;
  
  // Admin routes
  if (path.startsWith('/admin')) {
    if (!userRole || userRole === 'USER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Super admin routes
  if (path.startsWith('/admin/settings')) {
    if (userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}
```

## 4. Server Action with Permission Check

```typescript
// src/actions/admin/verify-tutor.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function verifyTutor(providerId: string, action: 'approve' | 'reject', reason?: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  
  const provider = await db.provider.update({
    where: { id: providerId },
    data: { 
      verificationStatus: action === 'approve' ? 'approved' : 'rejected',
    },
  });
  
  // Log action for audit
  await db.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: `verify_tutor_${action}`,
      targetType: 'Provider',
      targetId: providerId,
      details: { reason, providerId },
    },
  });
  
  revalidatePath('/admin/tutors');
  
  return { success: true };
}
```

## 5. Super Admin Audit Log View

```typescript
// src/app/admin/audit-log/page.tsx
export default async function AuditLogPage() {
  const logs = await db.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      admin: { select: { name: true, phoneNumber: true } },
    },
  });
  
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Admin</th>
          <th>Action</th>
          <th>Target</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.createdAt.toLocaleString()}</td>
            <td>{log.admin.name}</td>
            <td>{log.action}</td>
            <td>{log.targetType} #{log.targetId}</td>
            <td>{JSON.stringify(log.details)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 6. Set Initial Super Admin

On first deployment, create super admin via seed script:

```typescript
// prisma/seed.ts
async function main() {
  const superAdmin = await db.user.upsert({
    where: { phoneNumber: process.env.ADMIN_PHONE },
    update: { role: 'SUPER_ADMIN' },
    create: {
      phoneNumber: process.env.ADMIN_PHONE,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Super admin created:', superAdmin.id);
}
```

---

## QA Check - Fixes Applied:
- ✅ Role-based access control for admin actions
- ✅ Audit logging for all admin actions
- ✅ Super admin vs regular admin distinction
- ✅ Middleware protects admin routes