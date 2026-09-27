/**
 * A lightweight toggle-group built on plain div + shadcn Button.
 * Keeps the same API surface as Radix ToggleGroup but without the extra dep.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext({ value: "", onValueChange: () => {} });

const ToggleGroup = React.forwardRef(
  ({ className, value, onValueChange, children, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 border border-slate-200/60 p-1.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(ToggleGroupContext);
    const isActive = ctx.value === value;
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isActive}
        onClick={() => ctx.onValueChange(value)}
        className={cn(
          "inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap",
          isActive
            ? "bg-white text-blue-700 shadow-sm border border-slate-200"
            : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
