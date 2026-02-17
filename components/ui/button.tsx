"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold normal-case tracking-normal transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB8500] focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_24px_-12px_rgba(249,45,10,0.85)]",
        outline:
          "border border-[#748692] bg-transparent text-[#28323F] hover:-translate-y-0.5 hover:border-[#FB8500] hover:text-[#210E14]",
        secondary:
          "bg-[#28323F] text-[#EAF3F7] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(40,50,63,0.8)]",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
