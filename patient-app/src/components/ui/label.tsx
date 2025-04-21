import * as LabelPrimitive from "@rn-primitives/label";
import { forwardRef } from "react";
import { cn } from "./utils";

export const Label = forwardRef<
  LabelPrimitive.TextRef,
  LabelPrimitive.TextProps
>(
  (
    { onPress, onLongPress, onPressIn, onPressOut, className, ...props },
    ref,
  ) => (
    <LabelPrimitive.Root
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cn(
          "text-foreground text-base font-medium leading-none",
          className,
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;
