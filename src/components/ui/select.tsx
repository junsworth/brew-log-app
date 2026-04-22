import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextType = {
  value: string;
  setValue: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be wrapped in Select");
  }
  return context;
}

function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={{ value: value ?? "", setValue: onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children }: React.ComponentProps<"select">) {
  const { value, setValue } = useSelectContext();
  return (
    <select
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {children}
    </select>
  );
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

function SelectOptGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <optgroup label={label}>{children}</optgroup>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return placeholder ? <option value="">{placeholder}</option> : null;
}

export { Select, SelectContent, SelectItem, SelectOptGroup, SelectTrigger, SelectValue };
