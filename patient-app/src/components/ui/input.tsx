import { type ElementRef, forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "./utils";

export const Input = forwardRef<ElementRef<typeof TextInput>, TextInputProps>(
  ({ editable, className, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        editable={editable}
        className={cn(
          "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-lg file:border-0 file:bg-transparent file:font-medium",
          editable === false && "opacity-50",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
