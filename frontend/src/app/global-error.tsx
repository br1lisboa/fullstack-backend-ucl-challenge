"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-5xl">!</div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-gray-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
