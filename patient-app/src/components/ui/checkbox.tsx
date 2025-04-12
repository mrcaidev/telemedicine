import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { CheckIcon } from "lucide-react-native";
import { forwardRef } from "react";
import { Icon } from "./icon";
import { cn } from "./utils";

export const Checkbox = forwardRef<
  CheckboxPrimitive.RootRef,
  CheckboxPrimitive.RootProps
>(({ checked, className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      className={cn(
        "shrink-0 size-5 border border-input rounded disabled:opacity-50",
        checked && "border-primary bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="items-center justify-center size-full">
        <Icon
          as={CheckIcon}
          size={12}
          strokeWidth={3}
          className="text-primary-foreground"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
