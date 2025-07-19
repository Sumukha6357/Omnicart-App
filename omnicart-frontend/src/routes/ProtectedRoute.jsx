import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />
  }

  return children
}
