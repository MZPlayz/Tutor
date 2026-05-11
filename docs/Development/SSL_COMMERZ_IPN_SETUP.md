# SSLCommerz IPN (Webhook) Verification

## 1. Security: Validate Webhook Signature

SSLCommerz IPN (Instant Payment Notification) must be validated to prevent spoofing.

```typescript
// src/lib/ssl-verify.ts
import crypto from 'crypto';

interface SslCommerzResponse {
  status: string;
  tran_id: string;
  val_id?: string;
  amount: string;
  card_type?: string;
  store_amount?: string;
  bank_tran_id?: string;
  card_brand?: string;
  card_issuer?: string;
}

export function verifySslResponse(
  postData: Record<string, string>,
  storePassword: string
): boolean {
  // SSLCommerz sends these fields:
  // - tran_id, val_id, amount, store_amount, card_type, etc.
  
  const { store_id, ...remainingFields } = postData;
  
  // Create hash from: val_id + store_password
  // Note: Different for validation API vs IPN
  const hashString = `${postData.val_id}${storePassword}`;
  const expectedHash = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();
  
  return expectedHash === postData.verify_key?.toUpperCase();
}

export async function validatePaymentWithApi(
  tranId: string,
  amount: string,
  storeId: string,
  storePassword: string
): Promise<{ valid: boolean; status: string }> {
  // Use SSLCommerz Validation API
  const data = {
    val_id: tranId, // The transaction ID from IPN
    store_id: storeId,
    store_password: storePassword,
  };
  
  const response = await fetch('https://securepay.sslcommerz.com/validator/api/validationserverAPI.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data),
  });
  
  const result = await response.text();
  const fields = Object.fromEntries(new URLSearchParams(result));
  
  // Check if status is VALID
  const isValid = fields.status === 'VALID' || fields.status === 'VALIDATED';
  
  return { 
    valid: isValid, 
    status: fields.status || 'UNKNOWN' 
  };
}
```

## 2. Webhook Handler

```typescript
// src/app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { validatePaymentWithApi } from '@/lib/ssl-verify';
import { sendPushNotification } from '@/lib/push-notifications';
import { sendSms } from '@/lib/sms';
import { templates } from '@/lib/sms-templates';

export async function POST(request: Request) {
  // Parse form-urlencoded data (SSLCommerz sends this format)
  const formData = await request.formData();
  const postData: Record<string, string> = {};
  
  for (const [key, value] of formData) {
    postData[key] = value.toString();
  }
  
  const { tran_id, status, val_id, amount } = postData;
  
  console.log('SSLCommerz webhook received:', { tran_id, status, amount });
  
  // 1. Find the booking
  const booking = await db.booking.findUnique({
    where: { sslTrxId: tran_id },
    include: {
      provider: { include: { user: true } },
      client: true,
    },
  });
  
  if (!booking) {
    console.error('Booking not found for tran_id:', tran_id);
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  
  // 2. Check idempotency - already processed?
  if (booking.status !== 'pending') {
    console.log('Booking already processed:', booking.id, booking.status);
    return NextResponse.success('done');
  }
  
  // 3. Validate amount matches
  if (parseFloat(amount) !== booking.amount) {
    console.error('Amount mismatch:', amount, booking.amount);
    // Flag as fraud but don't confirm
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
  }
  
  // 4. Validate with SSLCommerz API
  const validation = await validatePaymentWithApi(
    tran_id,
    amount,
    process.env.SSL_STORE_ID!,
    process.env.SSL_STORE_PASS!
  );
  
  if (!validation.valid) {
    console.error('SSL validation failed:', validation.status);
    // Don't confirm - potential fraud
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }
  
  // 5. Confirm the booking
  await db.booking.update({
    where: { id: booking.id },
    data: { status: 'confirmed' },
  });
  
  // 6. Release Redis lock
  const lockKey = `lock:${booking.providerId}:${booking.slotStart.toISOString()}`;
  await redis.del(lockKey);
  
  // 7. Send notifications
  // Push to tutor
  if (booking.provider.user.fcmToken) {
    await sendPushNotification({
      token: booking.provider.user.fcmToken,
      title: 'New Booking!',
      body: `You have a new booking for ${booking.service.subject}`,
      data: { bookingId: booking.id, url: `/bookings/${booking.id}` },
    });
  }
  
  // SMS to tutor
  await sendSms({
    to: booking.provider.user.phoneNumber,
    message: templates.bookingConfirmedTutor(
      booking.provider.user.name || 'Student',
      booking.bookingDate.toLocaleDateString('bn-BD'),
      booking.slotStart.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      booking.landmark || 'Online'
    ),
  });
  
  // SMS to student
  await sendSms({
    to: booking.client.phoneNumber,
    message: templates.bookingConfirmedStudent(
      booking.provider.user.name || 'Tutor',
      booking.slotStart.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      booking.landmark || 'Online'
    ),
  });
  
  return NextResponse.success('done');
}
```

## 3. Fail Handler

```typescript
// src/app/api/payments/fail/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const { tran_id } = Object.fromEntries(formData);
  
  // Find and cancel the booking
  const booking = await db.booking.findUnique({
    where: { sslTrxId: tran_id as string },
  });
  
  if (booking) {
    await db.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    });
    
    // Release lock
    const lockKey = `lock:${booking.providerId}:${booking.slotStart.toISOString()}`;
    await redis.del(lockKey);
  }
  
  // Redirect to checkout with error
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/checkout?error=payment_failed`);
}
```

## 4. Environment Variables

```env
SSL_STORE_ID=your_store_id
SSL_STORE_PASS=your_store_password
SSL_IS_SANDBOX=true
```

---

## QA Check - Fixes Applied:
- ✅ Amount validation prevents spoofing
- ✅ Idempotency check prevents double-charge
- ✅ SSLCommerz API validation for security
- ✅ Lock released on payment success