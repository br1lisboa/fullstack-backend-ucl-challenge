import Link from "next/link";
import { defaultLocale } from "@/i18n/config";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-6xl font-bold text-gray-300">404</div>
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="max-w-md text-gray-500">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href={`/${defaultLocale}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
