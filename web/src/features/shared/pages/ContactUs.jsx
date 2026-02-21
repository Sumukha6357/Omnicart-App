import { useState } from "react";
import { subscribeNewsletter } from "../../../api/subscriptionApi";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: "error", message: "Email is required." });
      return;
    }
    try {
      setLoading(true);
      await subscribeNewsletter({ email, source: "contact-page" });
      setStatus({ type: "success", message: "You are subscribed. Our team will also share updates there." });
      setEmail("");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to submit. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 to-orange-500 px-6 py-10 text-white">
        <h1 className="text-3xl font-extrabold">Contact OmniCart</h1>
        <p className="mt-3 text-sm text-blue-50">
          Need help with orders, refunds, or seller onboarding? Reach out anytime.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="marketplace-panel p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Support</h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Email: support@omnicart.example</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Phone: +1 (555) 123-4567</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Hours: Mon-Fri, 9:00am-6:00pm</p>
        </div>

        <form onSubmit={handleSubmit} className="marketplace-panel p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Get Marketplace Updates</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Subscribe for launch announcements and offer drops.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
          {status.message && (
            <p className={`mt-3 text-sm ${status.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
