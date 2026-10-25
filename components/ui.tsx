"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * Button
 * ------------------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-sm disabled:opacity-50",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50",
  ghost: "hover:bg-secondary/70 text-foreground",
  danger: "bg-danger text-danger-foreground hover:opacity-90 disabled:opacity-50",
  outline:
    "border border-border bg-transparent hover:bg-secondary/60 text-foreground",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

/* ---------------------------------------------------------------------------
 * LinkButton: un enlace <a> que aparenta un Button (sin necesidad de asChild)
 * ------------------------------------------------------------------------- */

const LINK_VARIANTS: Record<Variant, string> = VARIANTS;

export function linkClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <a
      href={href}
      className={linkClasses(variant, size, className)}
      {...props}
    >
      {children}
    </a>
  );
}

/* ---------------------------------------------------------------------------
 * Card
 * ------------------------------------------------------------------------- */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold leading-tight", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

/* ---------------------------------------------------------------------------
 * Inputs
 * ------------------------------------------------------------------------- */

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm",
      "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm",
      "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring/60",
        className
      )}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------
 * Badge
 * ------------------------------------------------------------------------- */

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "primary" | "success" | "danger" | "muted";
}) {
  const styles: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    danger: "bg-danger/15 text-danger",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------
 * Spinner
 * ------------------------------------------------------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Tabs (controlado, sin dependencias externas)
 * ------------------------------------------------------------------------- */

export function Tabs({
  value,
  onValueChange,
  items,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  items: { value: string; label: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-lg bg-secondary/60 p-1",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm",
            value === item.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
