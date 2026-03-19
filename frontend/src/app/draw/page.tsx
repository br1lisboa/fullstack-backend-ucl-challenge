import { DrawActions } from "@/features/draw/components/draw-actions";
import { DrawStats } from "@/features/draw/components/draw-stats";
import { Separator } from "@/components/ui/separator";

export default function DrawPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Draw Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Execute or delete the Champions League draw.
        </p>
      </div>
      <DrawActions />
      <Separator />
      <div>
        <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
        <DrawStats />
      </div>
    </div>
  );
}
