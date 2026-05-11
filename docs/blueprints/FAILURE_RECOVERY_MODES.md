# Failure Mode Recovery

- **SSLCommerz Down:** Show "Maintenance" on payment page. Allow "Cash on Delivery" ONLY for Level 3 Tutors (Trusted).
- **GreenWeb SMS Down:** Fallback to Firebase Email auth or In-app notifications.
- **GPS Unavailable:** Force "Area Selection" (Tanbazar, Chasara) chips. Disable "Near Me" sorting.
- **Database Lag:** Optimistic UI updates. Show "Booking..." spinner and lock the button to prevent double-payment.