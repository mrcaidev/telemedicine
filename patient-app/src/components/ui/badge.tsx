import * as Slot from "@rn-primitives/slot";
import type { SlottableViewProps } from "@rn-primitives/types";
import { type VariantProps, cva } from "class-variance-authority";
import { View } from "react-native";
import { TextClassNameContext } from "./text";
import { cn } from "./utils";

export const badgeVariants = cva(
  "flex-row items-center px-2.5 py-0.5 border rounded-full",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary active:opacity-80",
        secondary: "border-transparent bg-secondary active:opacity-80",
        destructive: "border-transparent bg-destructive active:opacity-80",
        outline: "border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeProps = SlottableViewProps &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassNameContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    </TextClassNameContext.Provider>
  );
}
