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
import { useDictionary } from "@/i18n/context";

export function DrawActions() {
  const { data: draw, isLoading, error } = useDraw();
  const createMutation = useCreateDraw();
  const deleteMutation = useDeleteDraw();
  const t = useDictionary();

  const deleteAction = useConfirmAction({
    mutation: deleteMutation,
    successMessage: t.draw.drawDeleted,
    errorMessage: t.draw.failedToDelete,
  });

  const drawExists =
    !!draw && !(error instanceof ApiError && error.status === 404);

  function handleCreate() {
    createMutation.mutate(undefined, {
      onSuccess: () => toast.success(t.draw.drawCreated),
      onError: (err) =>
        toast.error(
          err instanceof ApiError ? err.message : t.draw.failedToCreate
        ),
    });
  }

  if (isLoading) {
    return (
      <div className="flex gap-3">
        <Button disabled>{t.draw.loading}</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {drawExists ? (
        <Dialog open={deleteAction.isOpen} onOpenChange={(open) => (open ? deleteAction.open() : deleteAction.close())}>
          <DialogTrigger render={<Button variant="destructive" />}>
            {t.draw.deleteDraw}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.draw.deleteDrawConfirm}</DialogTitle>
              <DialogDescription>
                {t.draw.deleteDrawDesc}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={deleteAction.close}>
                {t.draw.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={deleteAction.confirm}
                disabled={deleteAction.isPending}
              >
                {deleteAction.isPending ? t.draw.deleting : t.draw.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={handleCreate} disabled={createMutation.isPending}>
          {createMutation.isPending ? t.draw.creatingDraw : t.draw.executeDraw}
        </Button>
      )}
    </div>
  );
}
