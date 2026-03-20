"use client";

import { useState, useCallback } from "react";
import { type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/shared/api-client";

interface UseConfirmActionOptions<TData> {
  mutation: UseMutationResult<TData, Error, void>;
  successMessage: string;
  errorMessage?: string;
}

export function useConfirmAction<TData>({
  mutation,
  successMessage,
  errorMessage = "Action failed",
}: UseConfirmActionOptions<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const confirm = useCallback(() => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(successMessage);
        setIsOpen(false);
      },
      onError: (err) => {
        toast.error(
          err instanceof ApiError ? err.message : errorMessage
        );
      },
    });
  }, [mutation, successMessage, errorMessage]);

  return {
    isOpen,
    open,
    close,
    confirm,
    isPending: mutation.isPending,
  };
}
