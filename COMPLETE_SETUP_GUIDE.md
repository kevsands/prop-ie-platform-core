# Complete Platform Setup Guide

This guide will get the platform fully operational from its current state.

## Current Status
- ✅ Database schema defined (Prisma)
- ✅ Dependencies installed
- ✅ Basic API structure exists
- ✅ Authentication configured
- ❌ UI components need setup
- ❌ Most API routes need implementation
- ❌ Database needs migration
- ❌ Services need connection

## Step 1: Database Setup

```bash
# Create and migrate database
npx prisma migrate dev --name initial_setup

# Generate Prisma client
npx prisma generate

# Seed with test data (optional)
npm run db:seed
```

## Step 2: UI Component Setup

Since the project already has Radix UI components installed, we need to create the component files:

```bash
# Create component directory structure
mkdir -p src/components/ui

# Create base components
touch src/components/ui/card.tsx
touch src/components/ui/button.tsx
touch src/components/ui/input.tsx
touch src/components/ui/label.tsx
touch src/components/ui/badge.tsx
touch src/components/ui/tabs.tsx
touch src/components/ui/progress.tsx
touch src/components/ui/avatar.tsx
touch src/components/ui/scroll-area.tsx
touch src/components/ui/select.tsx
touch src/components/ui/separator.tsx
touch src/components/ui/slider.tsx
touch src/components/ui/checkbox.tsx
touch src/components/ui/toast.tsx
```

## Step 3: Implement Core UI Components

Here's a minimal implementation for key components:

### Card Component (src/components/ui/card.tsx)
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
```

### Button Component (src/components/ui/button.tsx)
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## Step 4: Create Missing API Routes

### Create Developments API Route
```typescript
// src/app/api/developments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const developments = await prisma.development.findMany({
      include: {
        location: true,
        units: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(developments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch developments" },
      { status: 500 }
    );
  }
}
```

### Create Transactions API Route
```typescript
// src/app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        unit: {
          include: {
            development: true,
          },
        },
        documents: true,
        statusHistory: true,
        timeline: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
```

## Step 5: Create Utils File

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Step 6: Start Development Server

```bash
# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

## Step 7: Test Basic Functionality

1. Navigate to http://localhost:3000
2. Try the property search: http://localhost:3000/properties/search
3. Test developer dashboard: http://localhost:3000/developer/dashboard

## Common Issues & Solutions

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Create database if needed
createdb prop_ie_db
```

### TypeScript Errors
```bash
# Regenerate types
npx prisma generate
npm run type-check
```

### Missing Environment Variables
Ensure all required variables are in `.env.local`:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

## Next Development Steps

1. **Complete API Routes**: Implement all missing endpoints
2. **Add WebSocket Server**: Set up Socket.io for real-time features
3. **Implement Services**: Connect the service layer to APIs
4. **Add Tests**: Write unit and integration tests
5. **Deploy**: Use the Terraform configuration for AWS deployment