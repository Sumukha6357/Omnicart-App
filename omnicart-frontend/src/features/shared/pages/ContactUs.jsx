import React from "react";

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 dark:text-slate-300 mb-6">
        Need help? Reach out and we will get back to you.
      </p>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded p-4">
        <p className="text-gray-700 dark:text-slate-300">Email: support@omnicart.example</p>
        <p className="text-gray-700 dark:text-slate-300">Phone: +1 (555) 123-4567</p>
        <p className="text-gray-700 dark:text-slate-300">Hours: Mon-Fri, 9am-6pm</p>
      </div>
    </div>
  );
};

export default ContactUs;
