import * as SeparatorPrimitive from "@rn-primitives/separator";
import { forwardRef } from "react";
import { cn } from "./utils";

export const Separator = forwardRef<
  SeparatorPrimitive.RootRef,
  SeparatorPrimitive.RootProps
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "w-full h-[1px]" : "w-[1px] h-full",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
