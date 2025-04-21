import * as TabsPrimitive from "@rn-primitives/tabs";
import { forwardRef } from "react";
import { TextClassNameContext } from "./text";
import { cn } from "./utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  TabsPrimitive.ListRef,
  TabsPrimitive.ListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex-row items-center justify-center py-1 rounded-md bg-muted",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef<
  TabsPrimitive.TriggerRef,
  TabsPrimitive.TriggerProps
>(({ className, ...props }, ref) => {
  const { value } = TabsPrimitive.useRootContext();
  return (
    <TextClassNameContext.Provider
      value={cn(
        "text-muted-foreground text-base font-medium",
        value === props.value && "text-foreground",
      )}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex-row items-center justify-center px-3 py-1.5 rounded-sm shadow-none",
          props.value === value &&
            "bg-background shadow-lg shadow-foreground/30",
          props.disabled && "opacity-50",
          className,
        )}
        {...props}
      />
    </TextClassNameContext.Provider>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = TabsPrimitive.Content;
