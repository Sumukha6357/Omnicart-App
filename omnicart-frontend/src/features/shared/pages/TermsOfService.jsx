import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 dark:text-slate-300 mb-4">
        These are sample terms for OmniCart. Replace this content with your real
        terms before production.
      </p>
      <h2 className="text-xl font-semibold mb-2">Usage</h2>
      <p className="text-gray-700 dark:text-slate-300 mb-4">
        By using OmniCart, you agree to follow applicable laws and our policies.
      </p>
      <h2 className="text-xl font-semibold mb-2">Accounts</h2>
      <p className="text-gray-700 dark:text-slate-300">
        You are responsible for maintaining the security of your account.
      </p>
    </div>
  );
};

export default TermsOfService;
