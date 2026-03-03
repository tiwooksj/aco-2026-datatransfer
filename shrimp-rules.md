# AWS Cost Monitor - Development Standards for AI Agents

**Project Purpose**: AWS 데이터 전송비용 이상 감지 및 자동조치 시스템으로, AI 기반 원인 분석과 관리자 승인 워크플로우를 제공하는 MVP 프로젝트

**Reference Documents**:

- Detailed Requirements: `@/docs/PRD.md`
- Development Roadmap: `@/docs/ROADMAP.md`
- Project Instructions: `@/CLAUDE.md`

---

## Project Architecture

### Directory Structure

```
/src
├── /app                          # Next.js 15 App Router pages
│   ├── /layout.tsx              # Root layout - affects ALL pages
│   ├── /page.tsx                # Landing page
│   ├── /login                   # Login page route
│   ├── /(protected)             # Protected routes group
│   │   ├── /layout.tsx          # Protected layout with navigation
│   │   ├── /anomalies           # Anomaly detection pages
│   │   ├── /approvals           # Admin approval pages
│   │   └── /reports             # Incident report pages
│   └── /globals.css             # Global TailwindCSS styles
├── /components
│   ├── /ui                      # shadcn/ui components (generated)
│   ├── /layout                  # Layout components (header, footer, container)
│   ├── /providers               # React context providers
│   ├── login-form.tsx           # Feature components
│   └── [other feature components]
├── /lib
│   ├── utils.ts                 # Utility functions (cn(), etc.)
│   ├── env.ts                   # Environment variables
│   └── fake/data.ts             # Mock/fake data for development
└── /types
    └── index.ts                 # TypeScript type definitions
```

### Key Directories

- **`/src/app`**: Next.js 15 App Router - all pages and layouts here
- **`/src/components/ui`**: shadcn/ui components - auto-generated, DO NOT edit directly
- **`/src/components`**: Feature and layout components
- **`/src/lib`**: Shared utilities and helpers
- **`/src/types`**: TypeScript type definitions

---

## Code Standards

### File Naming Conventions

| File Type        | Pattern          | Examples                                               |
| ---------------- | ---------------- | ------------------------------------------------------ |
| React Components | `PascalCase.tsx` | `LoginForm.tsx`, `AnomalyCard.tsx`, `Container.tsx`    |
| Pages            | `page.tsx`       | `src/app/login/page.tsx`                               |
| Layouts          | `layout.tsx`     | `src/app/layout.tsx`, `src/app/(protected)/layout.tsx` |
| Utilities        | `camelCase.ts`   | `utils.ts`, `validators.ts`                            |
| Types            | `index.ts`       | `src/types/index.ts`                                   |

### Component Structure

**All client-side interactive components MUST include `'use client'` directive at the top:**

```typescript
'use client'

import { useState } from 'react'
// ... rest of imports
```

**Import Organization** (strict order):

1. React/Next.js imports
2. Third-party library imports
3. Local component/utility imports (using `@/` alias)

Example:

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { loginSchema } from '@/lib/validators'
```

### TypeScript Requirements

- **Strict mode enabled**: Do not ignore TypeScript errors
- **Type all function parameters**: `function submit(values: LoginFormValues): void { }`
- **Type all component props**: Use `interface Props { }` or inline types
- **Use `type` for unions/objects**: `type Status = 'detected' | 'analyzing'`
- **Use `interface` for object shapes**: `interface AnomalyAlert { id: string; ... }`

### Language and UI Text

- **UI Language**: ALL user-facing text MUST be in **Korean** (한글)
- **Code comments**: Can be in English or Korean
- **Error messages**: Must be in Korean
- **Placeholder text**: Must be in Korean

Example:

```typescript
placeholder = '관리자 계정으로 로그인하세요'
description: '올바른 이메일 주소를 입력해 주세요.'
```

---

## Styling Standards

### TailwindCSS v4 + shadcn/ui (new-york style)

- **Styling library**: Only TailwindCSS v4 - NO other CSS libraries
- **Component library**: shadcn/ui with `new-york` style
- **Icons**: Lucide React (`lucide-react`)
- **Class organization**: Use prettier-plugin-tailwindcss (auto-formats Tailwind classes)

**shadcn/ui Component Usage**:

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Installation: npx shadcn@latest add button
```

**Adding new shadcn components**:

```bash
npx shadcn@latest add [component-name]
```

### Spacing and Layout

- Use TailwindCSS utility classes exclusively
- Common utilities: `p-4`, `m-2`, `w-full`, `max-w-md`, `space-y-4`, `gap-4`
- Responsive design: `md:`, `lg:`, `sm:` prefixes
- Flexbox: `flex`, `flex-col`, `items-center`, `justify-between`

---

## Form Standards

### React Hook Form + Zod Validation Pattern

All forms MUST follow this pattern:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Define Zod schema
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 주소를 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.').min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
})

// 2. Infer TypeScript type from schema
type LoginFormValues = z.infer<typeof loginSchema>

// 3. Create component
export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

**Form validation rules**:

- Define Zod schemas in same file or in `@/lib/validators.ts`
- Always use `zodResolver(schema)` with React Hook Form
- All validation messages MUST be in Korean
- Use FormField render pattern for consistency with shadcn/ui Form

---

## Next.js 15.5.3 App Router Specifics

### Protected Routes Implementation

Use route groups `(protected)` for authentication:

```
/src/app
├── /layout.tsx                    # Root layout
├── /login/page.tsx                # Public page
└── /(protected)
    ├── /layout.tsx                # Protected layout with auth check
    ├── /anomalies/page.tsx        # Protected page
    ├── /approvals/page.tsx        # Protected page
    └── /reports/page.tsx          # Protected page
```

**Protected Layout Pattern** (`src/app/(protected)/layout.tsx`):

```typescript
import { Header } from '@/components/layout/header'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Add authentication check
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
```

### Metadata Configuration

All metadata changes MUST be made in `/src/app/layout.tsx`:

- Default title: "AWS Cost Monitor"
- Title template: "%s | AWS Cost Monitor"
- Description updates: Edit `metadata.description`

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'AWS Cost Monitor',
    template: '%s | AWS Cost Monitor',
  },
  description: '...',
}
```

### Theme Provider Setup

Theme is configured in root layout with next-themes:

- Default theme: "system"
- HTML attribute: "class"
- Never modify ThemeProvider settings without reason

---

## Server Actions and API Patterns

### Server Actions Usage

When implementing data mutations (form submissions, approvals):

```typescript
'use client'

import { submitApproval } from '@/lib/actions/approvals'

export function ApprovalForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await submitApproval(formData)
    if (result.error) {
      toast.error(result.error)
    }
  }
  // ...
}
```

**Server Action File Pattern** (`src/lib/actions/[feature].ts`):

```typescript
'use server'

export async function submitApproval(formData: FormData) {
  try {
    // Process data
    return { success: true }
  } catch (error) {
    return { error: '처리 중 오류가 발생했습니다.' }
  }
}
```

---

## Key File Interaction Standards

### Files That Affect Multiple Pages

These files require careful updates as they impact the entire application:

| File                              | Purpose                             | When to Update                  | Coordination               |
| --------------------------------- | ----------------------------------- | ------------------------------- | -------------------------- |
| `/src/app/layout.tsx`             | Root layout, metadata, providers    | Metadata changes, theme updates | Affects ALL pages          |
| `/src/app/(protected)/layout.tsx` | Protected routes layout, navigation | Add/remove navigation items     | Affects protected pages    |
| `/src/app/globals.css`            | Global TailwindCSS styles           | Global style changes            | Affects entire app styling |
| `/src/lib/utils.ts`               | Shared utilities (cn function)      | New utility functions           | Used by many components    |
| `/src/types/index.ts`             | Type definitions                    | New domain types                | Used across application    |

### Navigation Updates

When adding new protected routes:

1. Create page in `/src/app/(protected)/[feature]/page.tsx`
2. Update Header navigation in `/src/components/layout/header.tsx`
3. Update types if new data structures needed

### Data Type Coordination

New domain types MUST be added to `/src/types/index.ts`:

```typescript
// src/types/index.ts
export interface AnomalyAlert {
  id: string
  serviceName: string
  detectedAt: Date
  // ... other fields
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
```

---

## AI Decision-Making Standards

### When Choices Are Ambiguous

**Priority Decision Tree**:

1. **Prefer existing patterns**: If similar functionality exists, follow its pattern
2. **Check PR and ROADMAP**: Align with documented requirements and roadmap
3. **TypeScript > JavaScript**: Always use strict types
4. **Server > Client**: Push logic to server when possible
5. **shadcn/ui > Custom**: Use shadcn components before custom solutions
6. **Korean UI text**: All user-facing text in Korean

### File Placement Rules

```
Components that render UI → /src/components
Logic/utilities → /src/lib
Type definitions → /src/types/index.ts
Server actions → /src/lib/actions/
```

### Component vs Function Decision

- **Component**: If it renders JSX and might have state
- **Function**: If it's pure logic that doesn't render

### When to Create New Files

Only create new files if:

- Feature is substantial enough to warrant its own file
- File would be >300 lines of code
- Other files need to import from it

Otherwise, add code to existing related file.

---

## Framework/Library Usage Standards

### React Hook Form

- MUST use for all forms
- ALWAYS pair with Zod schemas
- Use FormField render pattern
- Place schemas in same file (small) or `@/lib/validators.ts` (large)

### shadcn/ui Components

- Use `new-york` style exclusively
- Install via: `npx shadcn@latest add [component]`
- Never edit component source in `/src/components/ui/`
- Use props for customization

### Zod Validation

- Define schemas before types: `type LoginValues = z.infer<typeof loginSchema>`
- All validation messages in Korean
- Reusable schemas in `/src/lib/validators.ts`

### TailwindCSS v4

- No TailwindCSS config file needed (configless)
- Use standard utility classes
- Spacing scale: 1-96 (0.25rem - 24rem)
- Colors: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

### Lucide Icons

- Import: `import { IconName } from 'lucide-react'`
- Size: Use h-4 w-4 (default), h-5 w-5, h-6 w-6, h-8 w-8
- Colors: Use text-[color]-500 classes

---

## Workflow Standards

### Development Workflow

```bash
# Start development (Turbopack enabled)
npm run dev

# Before committing
npm run check-all          # Runs: typecheck + lint + format:check

# Fix issues
npm run lint:fix           # Fix ESLint issues
npm run format             # Format with Prettier
npm run typecheck          # Check TypeScript errors

# Build for production
npm run build
```

### Git Workflow

- Use conventional commits
- Minimum checks before commit:
  ```bash
  npm run check-all
  npm run build
  ```

---

## Prohibited Actions

### MUST NOT DO

- ❌ Add styling libraries other than TailwindCSS
- ❌ Create components without `'use client'` directive (if interactive)
- ❌ Ignore TypeScript strict mode errors
- ❌ Use hardcoded English text in UI (must be Korean)
- ❌ Modify or delete files in `/src/components/ui/` (shadcn generated)
- ❌ Create inline styles with `style={}` (use Tailwind classes)
- ❌ Use `any` type without explicit reason and comment
- ❌ Bypass ESLint or Prettier checks
- ❌ Add dependencies without running `npm install`
- ❌ Modify authentication logic without reviewing CLAUDE.md requirements
- ❌ Create global state with Context without documenting in `/src/types/index.ts`
- ❌ Mix styling approaches (Tailwind + CSS modules or CSS-in-JS)
- ❌ Create custom form components (use shadcn/ui forms)
- ❌ Leave TODOs without issue tracking
- ❌ Modify `/src/app/layout.tsx` metadata without all pages reviewed

### Code Review Gates

Before submitting code:

- [ ] Run `npm run check-all` passes
- [ ] Run `npm run build` succeeds
- [ ] All UI text is in Korean
- [ ] TypeScript strict mode satisfied
- [ ] No `any` types without justification
- [ ] Follows import organization order
- [ ] Uses established patterns (forms, components, etc.)

---

## Testing and Quality Standards

### ESLint + Prettier

- ESLint enforces code quality rules
- Prettier enforces consistent formatting
- Both are pre-commit hooks (Husky + lint-staged)
- Configuration: Next.js 15.5.3 defaults

### TypeScript Checking

```bash
npm run typecheck
```

Verify before committing:

- No implicit `any` types
- All function parameters typed
- All component props typed
- Union types properly defined

---

## Dependency Management

### Current Core Dependencies

| Package         | Version | Usage       |
| --------------- | ------- | ----------- |
| Next.js         | 15.5.3  | Framework   |
| React           | 19.1.0  | UI library  |
| TypeScript      | ^5      | Type safety |
| TailwindCSS     | ^4      | Styling     |
| shadcn/ui       | Latest  | Components  |
| React Hook Form | ^7.63   | Form state  |
| Zod             | ^4.1    | Validation  |
| Lucide React    | ^0.543  | Icons       |

### Adding Dependencies

**Before adding new packages:**

1. Check if shadcn has the component
2. Check if standard library provides it
3. Run `npm install [package]`
4. Update this document if significant

**Prohibited**:

- Multiple CSS-in-JS libraries
- Multiple form libraries
- Multiple validation libraries
- UI libraries other than shadcn/ui

---

## Summary of Critical Rules

1. **Language**: ALL UI text in Korean
2. **Styling**: TailwindCSS v4 + shadcn/ui only
3. **Forms**: React Hook Form + Zod mandatory
4. **Types**: TypeScript strict mode enforced
5. **Components**: `'use client'` for interactive components
6. **Files**: Follow strict import organization
7. **Patterns**: Use existing patterns as templates
8. **Checks**: Always run `npm run check-all` before commit
9. **References**: Check PRD.md and ROADMAP.md for requirements
10. **Avoid**: See "Prohibited Actions" section above
