import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { View } from "react-native";
import { cn } from "./utils";

export function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.RootProps & {
  ref?: React.RefObject<RadioGroupPrimitive.RootRef>;
}) {
  return (
    <RadioGroupPrimitive.Root className={cn("gap-2", className)} {...props} />
  );
}

export function RadioGroupItem({
  className,
  ...props
}: RadioGroupPrimitive.ItemProps & {
  ref?: React.RefObject<RadioGroupPrimitive.ItemRef>;
}) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "items-center justify-center size-5 rounded-full border border-foreground text-primary",
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <View className="size-[10px] rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
