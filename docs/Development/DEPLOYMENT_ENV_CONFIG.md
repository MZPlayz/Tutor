# Deployment & Environment Config: Tutor

## 1. Essential Variables (.env)
### Database & Redis
- `DATABASE_URL`: Neon Connection String
- `UPSTASH_REDIS_REST_URL`: Redis URL
- `UPSTASH_REDIS_REST_TOKEN`: Redis Token

### Auth (Firebase)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Payments (SSLCommerz)
- `SSL_STORE_ID`
- `SSL_STORE_PASS`
- `SSL_IS_SANDBOX`: (true/false)

### Third Party
- `GREENWEB_TOKEN`: SMS Gateway API Key
- `CLOUDINARY_URL`: cloudinary://api_key:api_secret@cloud_name

### App Config
- `NEXT_PUBLIC_URL`: (e.g., https://tutor.com.bd)
- `ADMIN_PHONE_NUMBER`: Your phone number (for dashboard access)

## 2. Deployment Steps
1. Push code to GitHub.
2. Connect Vercel to the Repo.
3. Import all .env variables.
4. Run `npx prisma generate` in the build command.
5. Run `npx prisma migrate deploy` in the post-install script.