import Breadcrumbs from "../Breadcrumbs";
import { getRoleHomePath } from "../../utils/navigation";

export default function CustomerPageShell({ userRole, pageLabel, title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", to: getRoleHomePath(userRole) }, { label: pageLabel }]} />

        <section className="mb-6 rounded-card border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
            </div>
            {actions}
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}
