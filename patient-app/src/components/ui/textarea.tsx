import { type ElementRef, forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "./utils";

export const Textarea = forwardRef<
  ElementRef<typeof TextInput>,
  TextInputProps
>(
  (
    {
      editable,
      multiline = true,
      numberOfLines = 4,
      className,
      placeholderClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <TextInput
        ref={ref}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        className={cn(
          "min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-foreground text-lg",
          editable === false && "opacity-50",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
