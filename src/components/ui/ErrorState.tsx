import { RefreshCw, TriangleExclamationPoint } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title,
  description,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50/60 px-6 py-8 sm:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600">
          <TriangleExclamationPoint aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-rose-950">{title}</h2>
          <p className="mt-1.5 text-sm leading-6 text-rose-800/80">
            {description}
          </p>
        </div>
        {onRetry ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="border-rose-200 bg-white text-rose-800 hover:border-rose-300 hover:bg-rose-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={isRetrying ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"}
            />
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
