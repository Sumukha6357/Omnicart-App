import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user, loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // ✅ Match backend ENUM

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login({ email, password, role }));
  };

  useEffect(() => {
    if (token && user) {
      const userRole = user.role?.toLowerCase();
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "seller") {
        navigate("/seller/dashboard");
      } else if (userRole === "customer") {
        navigate("/customer/home");
      } else {
        navigate("/");
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <a href="/signup" className="ml-2 text-blue-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
