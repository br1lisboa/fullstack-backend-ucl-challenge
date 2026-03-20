import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ChipProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void;
}

function Chip({ className, variant, children, onRemove, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props}>
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

interface ChipGroupProps extends React.ComponentProps<"div"> {}

function ChipGroup({ className, children, ...props }: ChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)} {...props}>
      {children}
    </div>
  );
}

export { Chip, ChipGroup, chipVariants };
