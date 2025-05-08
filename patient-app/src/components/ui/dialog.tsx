import * as DialogPrimitive from "@rn-primitives/dialog";
import { XIcon } from "lucide-react-native";
import { forwardRef } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Icon } from "./icon";
import { cn } from "./utils";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  DialogPrimitive.OverlayRef,
  DialogPrimitive.OverlayProps
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      style={StyleSheet.absoluteFill}
      className={cn(
        "flex items-center justify-center p-2 bg-black/80",
        className,
      )}
      {...props}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {/* biome-ignore lint/complexity/noUselessFragments: trust library */}
        <>{children}</>
      </Animated.View>
    </DialogPrimitive.Overlay>
  );
});
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = forwardRef<
  DialogPrimitive.ContentRef,
  DialogPrimitive.ContentProps & { portalHost?: string }
>(({ className, portalHost, children, ...props }, ref) => {
  const { open } = DialogPrimitive.useRootContext();
  return (
    // @ts-ignore
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "gap-4 max-w-lg p-6 border border-border rounded-lg shadow-lg shadow-foreground/10 z-50 bg-background",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 p-0.5 rounded-sm opacity-70">
            <Icon
              as={XIcon}
              size={18}
              className={cn(
                "text-muted-foreground",
                open && "text-accent-foreground",
              )}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ className, ...props }: ViewProps) => (
  <View
    className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: ViewProps) => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = forwardRef<
  DialogPrimitive.TitleRef,
  DialogPrimitive.TitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-foreground text-xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = forwardRef<
  DialogPrimitive.DescriptionRef,
  DialogPrimitive.DescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-base", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
