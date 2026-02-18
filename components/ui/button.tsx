"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-md text-sm font-semibold normal-case tracking-normal transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB8500] focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(105deg,#210E14_0%,#712825_34%,#F92D0A_72%,#FB8500_100%)] text-primary-foreground shadow-[0_14px_26px_-14px_rgba(249,45,10,0.9)] hover:-translate-y-0.5 hover:saturate-125 hover:shadow-[0_20px_32px_-14px_rgba(249,45,10,0.88)]",
        outline:
          "border border-white/60 bg-white/85 text-[#210E14] shadow-[0_12px_20px_-16px_rgba(33,14,20,0.7)] hover:-translate-y-0.5 hover:border-[#FB8500] hover:bg-white hover:text-[#712825]",
        secondary:
          "bg-[linear-gradient(120deg,#28323F_0%,#210E14_100%)] text-[#EAF3F7] shadow-[0_12px_20px_-12px_rgba(18,23,34,0.9)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_18px_30px_-16px_rgba(18,23,34,0.9)]",
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
