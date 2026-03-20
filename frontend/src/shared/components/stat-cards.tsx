import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  title: string;
  value: number | string;
}

function StatItem({ title, value }: StatItemProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

interface StatCardsRootProps {
  loading?: boolean;
  children: React.ReactNode;
  columns?: number;
}

function StatCardsRoot({ loading, children, columns = 4 }: StatCardsRootProps) {
  const gridClass = `grid gap-4 sm:grid-cols-2 lg:grid-cols-${columns}`;

  if (loading) {
    const count = Array.isArray(children) ? children.filter(Boolean).length : 1;
    return (
      <div className={gridClass}>
        {Array.from({ length: count || columns }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <div className={gridClass}>{children}</div>;
}

export const StatCards = Object.assign(StatCardsRoot, { Item: StatItem });
