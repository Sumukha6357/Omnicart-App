import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-slate-300 mb-4">
        This is a sample privacy policy for OmniCart. Replace this content with
        your real policy before production.
      </p>
      <h2 className="text-xl font-semibold mb-2">What We Collect</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 mb-4">
        <li>Account details you provide (name, email, phone).</li>
        <li>Order and payment information for purchases.</li>
        <li>Usage data to improve the site experience.</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">How We Use It</h2>
      <p className="text-gray-700 dark:text-slate-300">
        We use data to process orders, provide support, and improve OmniCart.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
