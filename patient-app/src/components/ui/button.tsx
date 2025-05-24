import { type VariantProps, cva } from "class-variance-authority";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";
import { Pressable } from "react-native";
import { TextClassNameContext } from "./text";
import { cn } from "./utils";

export const buttonVariants = cva(
  "group flex-row items-center justify-center gap-2 rounded-md disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/90",
        secondary: "bg-secondary active:bg-secondary/80",
        destructive: "bg-destructive active:bg-destructive/90",
        outline: "border border-input bg-background active:bg-accent",
        ghost: "active:bg-accent",
        link: "",
      },
      size: {
        default: "px-5 py-3",
        sm: "px-3 py-2",
        lg: "px-7 py-4",
        icon: "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const buttonTextVariants = cva("text-foreground text-base font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "group-active:text-accent-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "text-sm",
      lg: "text-lg",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ButtonProps = ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <TextClassNameContext.Provider
        value={buttonTextVariants({ variant, size })}
      >
        <Pressable
          ref={ref}
          role="button"
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        />
      </TextClassNameContext.Provider>
    );
  },
);
Button.displayName = "Button";
