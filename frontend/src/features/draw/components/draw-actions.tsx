"use client";

import { useCreateDraw, useDeleteDraw, useDraw } from "../hooks";
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
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/shared/api-client";

export function DrawActions() {
  const { data: draw, isLoading, error } = useDraw();
  const createMutation = useCreateDraw();
  const deleteMutation = useDeleteDraw();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const drawExists =
    !!draw && !(error instanceof ApiError && error.status === 404);

  function handleCreate() {
    createMutation.mutate(undefined, {
      onSuccess: () => toast.success("Draw created successfully"),
      onError: (err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to create draw"),
    });
  }

  function handleDelete() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Draw deleted successfully");
        setDeleteOpen(false);
      },
      onError: (err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to delete draw"),
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
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
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
