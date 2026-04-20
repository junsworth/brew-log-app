import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon, children, className }: Props) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="border-b bg-muted/50 px-3 py-2.5 sm:py-3">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-amber-600 sm:text-xs sm:tracking-widest">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-3 sm:pt-4">{children}</CardContent>
    </Card>
  );
}
