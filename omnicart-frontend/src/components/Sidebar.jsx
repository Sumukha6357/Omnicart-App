import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { sidebarMenus } from "../constants/sidebarMenus"

export default function Sidebar() {
  const { user } = useSelector((state) => state.user)
  const role = user?.role?.toLowerCase()
  const location = useLocation()

  const menus = sidebarMenus[role] || []

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r dark:border-slate-800 shadow-lg h-screen fixed left-0 top-0 p-5">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-blue-600 dark:text-blue-400">OmniCart</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          {role || "menu"}
        </p>
      </div>
      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-900"
              }`}
            >
              {menu.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}



