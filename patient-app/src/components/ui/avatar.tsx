import * as AvatarPrimitive from "@rn-primitives/avatar";
import { forwardRef } from "react";
import { cn } from "./utils";

export const Avatar = forwardRef<
  AvatarPrimitive.RootRef,
  AvatarPrimitive.RootProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("shrink-0 size-10 rounded-full overflow-hidden", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export const AvatarImage = forwardRef<
  AvatarPrimitive.ImageRef,
  AvatarPrimitive.ImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("size-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export const AvatarFallback = forwardRef<
  AvatarPrimitive.FallbackRef,
  AvatarPrimitive.FallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("items-center justify-center size-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
