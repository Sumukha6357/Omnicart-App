import { Link } from "react-router-dom"

const getHomeRoute = () => {
  const rawRole = localStorage.getItem("role")
  const rawUser = localStorage.getItem("user")

  let role = rawRole
  if (!role && rawUser) {
    try {
      const parsed = JSON.parse(rawUser)
      role = parsed?.role
    } catch {
      role = null
    }
  }

  const normalized = typeof role === "string" ? role.toLowerCase() : ""
  if (normalized === "admin") return "/admin/dashboard"
  if (normalized === "seller") return "/seller/dashboard"
  if (normalized === "customer") return "/customer/home"
  return "/"
}

const getHomeLabel = (path) => {
  if (path === "/admin/dashboard") return "Back to Admin Dashboard"
  if (path === "/seller/dashboard") return "Back to Seller Dashboard"
  if (path === "/customer/home") return "Back to Customer Home"
  return "Back to Home"
}

export default function NotFound() {
  const homePath = getHomeRoute()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4 text-slate-900 dark:text-slate-100">Page Not Found</p>
      <Link
        to={homePath}
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        {getHomeLabel(homePath)}
      </Link>
    </div>
  )
}
