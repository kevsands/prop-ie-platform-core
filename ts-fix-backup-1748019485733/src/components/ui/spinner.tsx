// src/components/ui/spinner.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
        xl: "h-12 w-12 border-4",
      variant: {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-[#2B5273]", // Your brand color
        white: "text-white",
        destructive: "text-destructive",
        muted: "text-muted-foreground"},
    defaultVariants: {
      size: "md",
      variant: "accent"}
);

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  srText?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, srText = "Loading...", ...props }, ref) => {
    return (
      <div role="status" ref={ref} {...props}>
        <div
          className={cn(spinnerVariants({ size, variant }), className)}
          aria-hidden="true"
        />
        <span className="sr-only">{srText}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";