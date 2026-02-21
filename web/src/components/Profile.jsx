import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUsername, updatePassword } from "../api/userApi";
import { updateName, logout } from "../redux/userSlice";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContext } from "../context/ToastContext";
import { LogOut, UserCircle2, ShieldCheck } from "lucide-react";

export default function Profile({ onClose }) {
  const { user, token } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useContext(ToastContext);

  const handleChangeName = async () => {
    if (!name || name === user?.name) return;
    setLoadingName(true);
    try {
      await updateUsername(user.id, name, token);
      dispatch(updateName(name));
      showToast("Name updated.", "success");
    } catch {
      showToast("Failed to update name.", "error");
    } finally {
      setLoadingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password) return;
    setLoadingPassword(true);
    try {
      await updatePassword(user.id, password, token);
      showToast("Password updated.", "success");
      setPassword("");
    } catch {
      showToast("Failed to update password.", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    showToast("Logged out successfully.", "info");
    navigate("/");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/35 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mt-4 mr-4 w-[min(92vw,380px)] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Profile</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-600 dark:text-slate-300">
            x
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || "No email"}</p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            {user?.role || "User"}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Theme</span>
          <button
            onClick={toggleTheme}
            className="rounded-lg bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-200">Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleChangeName} disabled={loadingName} className="primary-cta">
              {loadingName ? "Saving" : "Save"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-200">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setShowPassword((v) => !v)} className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            {showPassword ? "Hide" : "Show"} password
          </button>
          <button onClick={handleChangePassword} disabled={loadingPassword} className="primary-cta mt-2 w-full">
            {loadingPassword ? "Updating" : "Change Password"}
          </button>
        </div>

        {user?.role?.toLowerCase() === "customer" && (
          <button
            onClick={() => {
              navigate("/orders");
              onClose();
            }}
            className="accent-cta mt-2 w-full"
          >
            View Order History
          </button>
        )}

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
