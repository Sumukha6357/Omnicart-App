const ProductGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-card border border-slate-200 bg-white p-3.5 shadow-card dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="aspect-[4/5] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
