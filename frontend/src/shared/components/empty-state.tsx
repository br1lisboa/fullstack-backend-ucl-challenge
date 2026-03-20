interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed py-12 px-4">
      <p className="text-center text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
