import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const stylesByType = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  error: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200",
  info: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200",
};

const iconByType = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

export default function ToastStack({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-[min(92vw,360px)] flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`toast-enter pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${stylesByType[toast.type] || stylesByType.info}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => onClose(toast.id)}
              className="rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
