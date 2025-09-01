import { Link } from "react-router";

// Footer with a simple brand, quick links, and legal row.
// Uses only semantic HTML and tailwind utility classes for layout;
// no external component dependencies required here.
export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded bg-black text-white text-xs">G</div>
            <span className="font-semibold">GANA</span>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
            <a href="#home" className="hover:text-black">Home</a>
            <a href="#services" className="hover:text-black">Services</a>
            <a href="#pricing" className="hover:text-black">Pricing</a>
            <Link to="/orders" className="hover:text-black">Track Order</Link>
            <a href="#about" className="hover:text-black">About</a>
            <a href="#contact" className="hover:text-black">Contact</a>
          </nav>

          {/* Legal */}
          <div className="flex w-full items-center justify-between text-xs text-gray-500">
            <p>© 2024 GANA. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#terms" className="hover:text-black">Terms</a>
              <a href="#privacy" className="hover:text-black">Privacy</a>
              <a href="#cookies" className="hover:text-black">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

