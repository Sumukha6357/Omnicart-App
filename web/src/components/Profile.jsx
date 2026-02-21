import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUsername, updatePassword } from "../api/userApi";
import { updateName, logout } from "../redux/userSlice";
import { ThemeContext } from "../context/ThemeContext";

export default function Profile({ onClose }) {
  const { user, token } = useSelector(state => state.user);
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleChangeName = async () => {
    if (!name || name === user?.name) return;
    setLoadingName(true);
    try {
      await updateUsername(user.id, name, token);
      dispatch(updateName(name));
      alert("Name updated successfully!");
    } catch (err) {
      alert("Failed to update name");
    } finally {
      setLoadingName(false);
    }
  };
  const handleChangePassword = async () => {
    if (!password) return;
    setLoadingPassword(true);
    try {
      await updatePassword(user.id, password, token);
      alert("Password updated successfully!");
      setPassword("");
    } catch (err) {
      alert("Failed to update password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-30 dark:bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mt-4 mr-4 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded shadow-lg p-6 min-w-[300px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-slate-300 hover:text-red-600 text-2xl">x</button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">Theme</span>
          <button
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 px-3 py-1 rounded hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            className="w-full border dark:border-slate-700 px-3 py-2 rounded bg-white dark:bg-slate-900 dark:text-slate-100"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={handleChangeName}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Change Name
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border dark:border-slate-700 px-3 py-2 rounded bg-white dark:bg-slate-900 dark:text-slate-100"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShowPassword(v => !v)}
            className="ml-2 text-sm text-blue-600 dark:text-blue-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          <button
            onClick={handleChangePassword}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 block"
          >
            Change Password
          </button>
        </div>
        {user?.role?.toLowerCase() === "customer" && (
          <button
            onClick={() => { navigate("/orders"); onClose(); }}
            className="w-full bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 mt-2"
          >
            View Order History
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
