import * as Slot from "@rn-primitives/slot";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import { createContext, forwardRef, useContext } from "react";
import { Text as NativeText } from "react-native";
import { cn } from "./utils";

export const TextClassNameContext = createContext("");

export const Text = forwardRef<TextRef, SlottableTextProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const textClassName = useContext(TextClassNameContext);
    const Component = asChild ? Slot.Text : NativeText;
    return (
      <Component
        ref={ref}
        className={cn("text-foreground text-base", textClassName, className)}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";
