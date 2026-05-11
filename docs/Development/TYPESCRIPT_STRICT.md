# TypeScript Strict Configuration

## 1. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 2. Strict Mode Explained

| Option | Value | Why |
|--------|-------|-----|
| `strict` | `true` | Enables all strict type-checking options |
| `noImplicitAny` | `true` (via strict) | Prevents `any` types - must be explicit |
| `strictNullChecks` | `true` (via strict) | Must handle null/undefined |
| `strictFunctionTypes` | `true` (via strict) | Function params must match exactly |
| `noUnusedLocals` | `true` | Catches unused variables |
| `noUnusedParameters` | `true` | Catches unused function params |

## 3. Common Strict Patterns

### Non-null assertion (when sure)
```typescript
// BAD - allows null
const name = user.name;

// GOOD - explicit handling
const name = user.name ?? 'Anonymous';
```

### Optional chaining
```typescript
// BAD - crashes if provider is null
const rate = provider.services[0].ratePerHour;

// GOOD - safe access
const rate = provider.services?.[0]?.ratePerHour ?? 0;
```

### Type guards
```typescript
function isProvider(user: User): user is User & { provider: Provider } {
  return user.roles.includes('tutor');
}

if (isProvider(user)) {
  // TypeScript knows user has provider here
  const rate = user.provider.services[0].ratePerHour;
}
```

## 4. Zod Integration for Runtime Validation

```typescript
import { z } from 'zod';

// Define schema
const BookingSchema = z.object({
  providerId: z.string().uuid(),
  slotStart: z.string().datetime(),
  landmark: z.string().min(10),
});

// Type from schema
type BookingInput = z.infer<typeof BookingSchema>;

// Use in Server Action
export async function createBooking(data: BookingInput) {
  // Safe - data is typed
  const booking = await db.booking.create({
    data: {
      providerId: data.providerId,
      slotStart: new Date(data.slotStart),
      landmark: data.landmark,
    },
  });
  return booking;
}
```

## 5. Component Props Typing

```typescript
// BAD - any props
function Button({ children, onClick }) { ... }

// GOOD - explicit types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

function Button({ children, onClick, variant = 'primary', isLoading }: ButtonProps) {
  // ...
}
```

## 6. API Response Typing

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Usage
function getTutor(id: string): Promise<ApiResponse<Tutor>> {
  // ...
}
```

## 7. Disable Strict for Migration (Temporary)

If strict is too aggressive initially, disable specific rules:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}
```

Then enable one at a time as you fix issues.

---

## QA Check - Fixes Applied:
- ✅ Strict mode catches type errors at compile time
- ✅ Zod schemas provide runtime validation
- ✅ Explicit types for all components and APIs
- ✅ No implicit any - code is self-documenting