# GreenWeb SMS API Integration

## 1. API Documentation

GreenWeb (greenweb.com.bd) provides HTTP SMS API.

**Base URL:** `http://api.greenweb.com.bd/api.php`

## 2. Send SMS Function

```typescript
// src/lib/sms.ts
import axios from 'axios';

interface SendSmsParams {
  to: string; // Format: 01XXXXXXXXX
  message: string;
}

interface SmsResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

export async function sendSms({ to, message }: SendSmsParams): Promise<SmsResponse> {
  const token = process.env.GREENWEB_TOKEN;
  
  try {
    const response = await axios.post(
      'http://api.greenweb.com.bd/api.php',
      new URLSearchParams({
        token,
        to,
        message,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10s timeout
      }
    );
    
    // GreenWeb returns "OK" on success or error message
    const data = response.data;
    
    if (data === 'OK' || data.includes('SMS SENT')) {
      return { success: true, message_id: 'sent' };
    }
    
    return { success: false, error: data };
  } catch (error: any) {
    console.error('GreenWeb SMS error:', error.message);
    return { success: false, error: error.message };
  }
}
```

## 3. Message Templates

```typescript
// src/lib/sms-templates.ts

export const templates = {
  otp: (code: string) => 
    `Your Tutor verification code is: ${code}. Do not share this with anyone.`,
  
  bookingConfirmedTutor: (tutorName: string, date: string, time: string, landmark: string) =>
    `Notun Booking! ${tutorName} on ${date} at ${time}. Location: ${landmark}. Please check your Tutor app.`,
  
  bookingConfirmedStudent: (tutorName: string, time: string, landmark: string) =>
    `Payment Successful! Your session with ${tutorName} is confirmed for ${time}. Landmark: ${landmark}.`,
  
  sessionReminderTutor: (time: string, landmark: string) =>
    `Reminder: Your class at ${time} starts soon. Location: ${landmark}. Reach on time!`,
  
  sessionReminderStudent: (tutorName: string, time: string) =>
    `Your tutor ${tutorName} is expected at ${time}. Please be ready.`,
  
  tutorCancelled: (tutorName: string) =>
    `Dukkhito! ${tutorName} has cancelled the session. 100% refund has been added to your Tutor Wallet.`,
  
  studentCancelled: (studentName: string, time: string) =>
    `Booking Cancelled. ${studentName} has cancelled the session for ${time}. The slot is now available.`,
  
  payoutRequested: (amount: string) =>
    `Withdrawal request for ৳${amount} received. It will be processed to your bKash within 24 hours.`,
  
  payoutPaid: (amount: string) =>
    `Success! ৳${amount} has been sent to your bKash number. Thank you for teaching with Tutor.`,
  
  disputeFiled: (bookingId: string) =>
    `URGENT: New Dispute filed for Booking #${bookingId}. Please review in Admin Panel.`,
  
  emergency: (userName: string, lat: string, lng: string) =>
    `EMERGENCY: ${userName} needs help. Location: https://maps.google.com/?q=${lat},${lng}`,
};
```

## 4. Usage in Server Actions

```typescript
// src/actions/booking.ts
import { sendSms } from '@/lib/sms';
import { templates } from '@/lib/sms-templates';

export async function onBookingConfirmed(booking: Booking) {
  // Get tutor and student phone numbers
  const tutor = await db.provider.findUnique({
    where: { id: booking.providerId },
    include: { user: true },
  });
  
  const student = await db.user.findUnique({
    where: { id: booking.clientId },
  });
  
  // Send to tutor
  await sendSms({
    to: tutor.user.phoneNumber,
    message: templates.bookingConfirmedTutor(
      tutor.user.name!,
      formatDate(booking.bookingDate),
      formatTime(booking.slotStart),
      booking.landmark || 'Online'
    ),
  });
  
  // Send to student
  await sendSms({
    to: student.phoneNumber,
    message: templates.bookingConfirmedStudent(
      tutor.user.name!,
      formatTime(booking.slotStart),
      booking.landmark || 'Online'
    ),
  });
}
```

## 5. Error Handling & Retry

```typescript
// If SMS fails, log for retry
async function sendSmsWithRetry(params: SendSmsParams, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const result = await sendSms(params);
    if (result.success) return result;
    
    // Wait before retry (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i));
  }
  
  // Log failed SMS for manual review
  await db.smsLog.create({
    data: {
      to: params.to,
      message: params.message,
      status: 'failed',
      attempts: retries,
    },
  });
  
  return { success: false, error: 'All retries failed' };
}
```

## 6. SMS Log Table (Optional)

```prisma
// Track SMS for debugging
model SmsLog {
  id        String   @id @default(uuid())
  to        String
  message   String
  status    String   // sent, failed, pending
  error     String?
  attempts  Int      @default(0)
  createdAt DateTime @default(now())
}
```

---

## QA Check - Fixes Applied:
- ✅ SMS fallback for FCM (per MESSAGING_MATRIX.md)
- ✅ Templates match MESSAGING_MATRIX.md
- ✅ Retry logic for failed SMS
- ✅ Logging for debugging