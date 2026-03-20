"use client";

import { useCreateDraw, useDeleteDraw, useDraw } from "../hooks";
import { useConfirmAction } from "@/shared/hooks/use-confirm-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApiError } from "@/shared/api-client";

export function DrawActions() {
  const { data: draw, isLoading, error } = useDraw();
  const createMutation = useCreateDraw();
  const deleteMutation = useDeleteDraw();

  const deleteAction = useConfirmAction({
    mutation: deleteMutation,
    successMessage: "Draw deleted successfully",
    errorMessage: "Failed to delete draw",
  });

  const drawExists =
    !!draw && !(error instanceof ApiError && error.status === 404);

  function handleCreate() {
    createMutation.mutate(undefined, {
      onSuccess: () => toast.success("Draw created successfully"),
      onError: (err) =>
        toast.error(
          err instanceof ApiError ? err.message : "Failed to create draw"
        ),
    });
  }

  if (isLoading) {
    return (
      <div className="flex gap-3">
        <Button disabled>Loading...</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {drawExists ? (
        <Dialog open={deleteAction.isOpen} onOpenChange={(open) => (open ? deleteAction.open() : deleteAction.close())}>
          <DialogTrigger render={<Button variant="destructive" />}>
            Delete Draw
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete draw?</DialogTitle>
              <DialogDescription>
                This will remove the current draw and all 144 matches. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={deleteAction.close}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAction.confirm}
                disabled={deleteAction.isPending}
              >
                {deleteAction.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={handleCreate} disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating draw..." : "Execute Draw"}
        </Button>
      )}
    </div>
  );
}
