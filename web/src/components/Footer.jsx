import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeNewsletter } from "../api/subscriptionApi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: "error", message: "Enter an email address." });
      return;
    }

    try {
      setLoading(true);
      await subscribeNewsletter({ email, source: "footer" });
      setStatus({ type: "success", message: "Subscribed. Weekly deals are on the way." });
      setEmail("");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not subscribe right now. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-center">
          <div>
            <p className="marketplace-chip mb-3">OmniCart Marketplace</p>
            <h2 className="text-2xl font-extrabold text-slate-900">Bright deals, real-time drops.</h2>
            <p className="mt-2 text-sm text-slate-600">
              Subscribe for launch deals and restock alerts.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Joining..." : "Subscribe"}
            </button>
          </form>
        </div>

        {status.message && (
          <p className={`text-sm ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {status.message}
          </p>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row">
          <p>(c) {new Date().getFullYear()} OmniCart. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link to="/privacy" className="hover:text-blue-700">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-700">Terms</Link>
            <Link to="/contact" className="hover:text-blue-700">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
