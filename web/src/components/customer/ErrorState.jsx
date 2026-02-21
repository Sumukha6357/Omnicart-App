const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="rounded-card border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/60 dark:bg-red-950/20">
      <p className="text-sm font-medium text-red-700 dark:text-red-300">{message || "Something went wrong."}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
