import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { sidebarMenus } from "../constants/sidebarMenus"

export default function Sidebar() {
  const { user } = useSelector((state) => state.user)
  const role = user?.role?.toLowerCase()
  const location = useLocation()

  const menus = sidebarMenus[role] || []

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-5">
      <h2 className="text-xl font-bold mb-6 text-blue-600">OmniCart</h2>
      <nav className="flex flex-col gap-3">
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`px-3 py-2 rounded hover:bg-blue-100 ${
              location.pathname === menu.path ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
