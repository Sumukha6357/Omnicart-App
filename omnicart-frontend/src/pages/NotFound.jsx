import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <Link
        to="/"
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        🔙 Back to Home
      </Link>
    </div>
  )
}
