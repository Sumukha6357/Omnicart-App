const EmptyState = ({ onReset }) => {
  return (
    <div className="rounded-card border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No products found</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Try changing filters or clear them to see all products.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Reset filters
      </button>
    </div>
  );
};

export default EmptyState;
