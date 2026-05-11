# API Error Handling & Response Format

## 1. Standard Error Response Structure

All API responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_LIMIT",
    "message": "Maximum 3 OTP requests per hour",
    "details": {}
  }
}
```

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "name": "John"
  }
}
```

## 2. Error Codes by Category

### Authentication (AUTH_*)
| Code | HTTP | Message |
|------|------|---------|
| AUTH_OTP_LIMIT | 429 | Maximum 3 OTP requests per hour |
| AUTH_OTP_EXPIRED | 400 | OTP expired. Resend new code |
| AUTH_OTP_INVALID | 400 | Invalid OTP entered |
| AUTH_SESSION_EXPIRED | 401 | Please login again |
| AUTH_UNAUTHORIZED | 401 | Access denied |

### Booking (BOOKING_*)
| Code | HTTP | Message |
|------|------|---------|
| BOOKING_SLOT_LOCKED | 409 | Someone is currently booking this slot |
| BOOKING_SLOT_EXPIRED | 400 | Slot reservation expired. Select again |
| BOOKING_SLOT_UNAVAILABLE | 400 | Slot already booked |
| BOOKING_LEAD_TIME | 400 | Must book X hours in advance |
| BOOKING_PENDING_LIMIT | 400 | Max 3 pending bookings allowed |
| BOOKING_TUTOR_SUSPENDED | 400 | This tutor is currently suspended |

### Payment (PAYMENT_*)
| Code | HTTP | Message |
|------|------|---------|
| PAYMENT_FAILED | 400 | Payment failed. Try again |
| PAYMENT_DUPLICATE | 400 | Payment already processed |
| PAYMENT_AMOUNT_MISMATCH | 400 | Amount mismatch - possible fraud |

### Wallet (WALLET_*)
| Code | HTTP | Message |
|------|------|---------|
| WALLET_INSUFFICIENT | 400 | Insufficient balance |
| WALLET_WITHDRAW_MIN | 400 | Minimum withdrawal is ৳500 |
| WALLET_STRIKE_BLOCKED | 403 | Account suspended due to strikes |

### Validation (VALIDATION_*)
| Code | HTTP | Message |
|------|------|---------|
| VALIDATION_REQUIRED | 400 | Required field missing |
| VALIDATION_FORMAT | 400 | Invalid format |
| VALIDATION_LENGTH | 400 | Field length out of bounds |
| VALIDATION_PHONE_BLOCKED | 400 | Phone numbers not allowed |

## 3. Server Action Error Handling

Use `zod` for validation + custom error classes:

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage in Server Actions
if (otpCount >= 3) {
  throw new AppError('AUTH_OTP_LIMIT', 'Max 3 OTPs/hour', 429);
}
```

## 4. Frontend Error Display

- **Toast Notifications:** For non-critical errors (validation, limits)
- **Modal:** For critical errors (payment failure, account suspended)
- **Inline:** For form field errors (red border + message below field)

---

## QA Check - Fixes Applied:
- ✅ All error codes mapped to specific issues from audit
- ✅ BOOKING_SLOT_LOCKED prevents race condition confusion
- ✅ WALLET_STRIKE_BLOCKED handles suspended tutors
- ✅ VALIDATION_PHONE_BLOCKED integrates with anti-cheat