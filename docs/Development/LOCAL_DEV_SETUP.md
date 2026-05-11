# Local Development Setup (Docker)

## 1. Docker Compose Configuration

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # PostgreSQL with PostGIS
  postgres:
    image: postgis/postgis:15-3.3
    container_name: tutor-db
    environment:
      POSTGRES_USER: tutor
      POSTGRES_PASSWORD: tutor_dev
      POSTGRES_DB: tutor_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tutor"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis for slot locking and rate limiting
  redis:
    image: redis:7-alpine
    container_name: tutor-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # Local S3-compatible storage (MinIO for uploads)
  minio:
    image: minio/minio
    container_name: tutor-minio
    environment:
      MINIO_ROOT_USER: tutor
      MINIO_ROOT_PASSWORD: tutor_dev
    ports:
      - "9000:9000"
      - "9001:9001" # Console
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

## 2. Environment Setup

Create `.env.local` for local development:

```env
# Database (Docker)
DATABASE_URL="postgresql://tutor:tutor_dev@localhost:5432/tutor_dev?schema=public"

# Redis (Docker)
UPSTASH_REDIS_REST_URL="http://localhost:6379"
UPSTASH_REDIS_REST_TOKEN="local_dev_token"

# Firebase (Use test project)
NEXT_PUBLIC_FIREBASE_API_KEY="test_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tutor-test.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tutor-test"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tutor-test.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="test_vapid_key"

# SSLCommerz (Sandbox)
SSL_STORE_ID="test_store"
SSL_STORE_PASS="test_pass"
SSL_IS_SANDBOX=true

# GreenWeb (Test account)
GREENWEB_TOKEN="test_token"

# Cloudinary (Use test cloud)
CLOUDINARY_URL="cloudinary://test_key:test_secret@test_cloud"

# App
NEXT_PUBLIC_URL="http://localhost:3000"
ADMIN_PHONE_NUMBER="01XXXXXXXXX"
```

## 3. Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres redis
```

## 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to local DB
npm run db:push

# (Optional) Seed data
npm run db:seed
```

## 5. Stop Services

```bash
# Stop and remove containers
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## 6. Troubleshooting

```bash
# Reset database
npm run db:push -- --force-reset

# Check PostgreSQL logs
docker-compose logs postgres

# Check Redis connection
docker exec -it tutor-redis redis-cli ping
```

---

## QA Check - Fixes Applied:
- ✅ PostGIS included for geo queries
- ✅ Redis for slot locking (same as production)
- ✅ MinIO for local file uploads (simulates Cloudinary)
- ✅ Health checks ensure services ready before app starts