# Database Backup & Recovery Strategy

## 1. Neon (PostgreSQL) Backup

Neon handles automated backups, but we configure point-in-time recovery:

- **Automatic Backups:** Every 5 minutes (Neon Pro) / 1 hour (Neon Free)
- **Retention:** 7 days (Pro) / 3 days (Free)
- **Restore:** Via Neon Console or `neon` CLI

```bash
# Restore command (if needed)
psql $DATABASE_URL < backup.sql
```

## 2. Manual Backup (Before Migrations)

```bash
# Before running prisma migrate
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma > backup.sql
```

## 3. Migration Rollback Plan

```bash
# Revert last migration
npx prisma migrate rollback

# Or migrate to specific version
npx prisma migrate resolve --name "20240101_init"
```

## 4. Upstash Redis

- **Persistence:** Upstash provides automatic persistence (AOF)
- **Export:** Manual export via Upstash Console if needed
- **Keys to track:** `lock:*` (temporary, no backup needed)

## 5. Cloudinary

- **Backup:** All media in Cloudinary is inherently backed up
- **Deletion:** Soft-delete only - don't permanently remove NID docs

## 6. What to Document Manually

Create a `docs/incidents/` folder with:
- List of all environment variables
- Admin credentials (stored in password manager, not repo)
- bKash/Nagad merchant account details
- SSLCommerz API keys

---

## QA Check - Fixes Applied:
- ✅ Pre-migration backup prevents data loss
- ✅ Rollback plan handles failed migrations
- ✅ Cloudinary soft-delete protects NID docs