// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} OmniCart. All rights reserved.</p>
        <div className="space-x-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
