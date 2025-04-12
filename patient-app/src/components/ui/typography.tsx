import * as Slot from "@rn-primitives/slot";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import { forwardRef } from "react";
import { Text as NativeText } from "react-native";
import { cn } from "./utils";

export const H1 = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        role="heading"
        aria-level="1"
        className={cn(
          "text-foreground text-4xl font-extrabold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H1.displayName = "H1";

export const H2 = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        role="heading"
        aria-level="2"
        className={cn(
          "text-foreground text-3xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H2.displayName = "H2";

export const H3 = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        role="heading"
        aria-level="3"
        className={cn(
          "text-foreground text-2xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H3.displayName = "H3";

export const H4 = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        role="heading"
        aria-level="4"
        className={cn(
          "text-foreground text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H4.displayName = "H4";

export const P = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-foreground text-base", className)}
        {...props}
      />
    );
  },
);
P.displayName = "P";

export const BlockQuote = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn(
          "pl-3 border-l-2 border-border mt-4 text-foreground text-base italic",
          className,
        )}
        {...props}
      />
    );
  },
);
BlockQuote.displayName = "BlockQuote";

export const Code = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn(
          "relative px-2 py-1 rounded-md bg-muted text-foreground text-sm font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
);
Code.displayName = "Code";

export const Lead = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-muted-foreground text-xl", className)}
        {...props}
      />
    );
  },
);
Lead.displayName = "Lead";

export const Large = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-foreground text-lg", className)}
        {...props}
      />
    );
  },
);
Large.displayName = "Large";

export const Small = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-foreground text-sm", className)}
        {...props}
      />
    );
  },
);

Small.displayName = "Small";

export const Muted = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  },
);
Muted.displayName = "Muted";
