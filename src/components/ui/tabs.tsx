"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be wrapped in Tabs");
  }
  return context;
}

function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("inline-flex rounded-md bg-muted p-1 text-muted-foreground", className)}
      {...props}
    />
  );
}

function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useTabsContext();
  const active = context.value === value;
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition",
        "min-h-10 sm:min-h-8",
        active ? "bg-background text-foreground shadow-xs" : "hover:text-foreground",
        className
      )}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useTabsContext();
  if (context.value !== value) {
    return null;
  }
  return <div className={cn(className)}>{children}</div>;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
