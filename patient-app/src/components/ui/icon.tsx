import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useContext } from "react";
import { TextClassNameContext } from "./text";
import { cn } from "./utils";

export type IconProps = LucideProps & {
  as: LucideIcon;
};

export const Icon = ({ as: Component, className, ...props }: IconProps) => {
  cssInterop(Component, {
    className: {
      target: "style",
      nativeStyleToProp: {
        width: true,
        height: true,
        color: true,
        opacity: true,
      },
    },
  });

  const textClassName = useContext(TextClassNameContext);

  return (
    <Component
      size={16}
      className={cn("text-foreground", textClassName, className)}
      {...props}
    />
  );
};
