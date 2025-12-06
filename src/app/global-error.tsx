"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Une erreur s&apos;est produite
            </h2>
            <p className="text-gray-600 mb-6">
              Nous sommes désolés, quelque chose s&apos;est mal passé.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
