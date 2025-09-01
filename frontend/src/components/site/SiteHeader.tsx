import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { logout } from "@/state/slices/authSlice";

// Simple, responsive site header built with shadcn/ui buttons and semantic
// markup. The navigation links point to on-page sections; primary actions link
// to auth and the order flow.
export default function SiteHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));

  const onLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid h-6 w-6 place-items-center rounded bg-black text-white text-xs">G</div>
          <span>GANA</span>
        </Link>

        {/* Primary nav (anchors to sections in the page) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#services" className="hover:text-black">Services</a>
          <a href="#pricing" className="hover:text-black">Pricing</a>
          <Link to="/orders" className="hover:text-black">Track Order</Link>
          <a href="#about" className="hover:text-black">About</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link to="/orders">
                <Button variant="outline">My Orders</Button>
              </Link>
              <Button onClick={onLogout}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </>
          )}
          <Link to="/orders/new/service">
            <Button>Book Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

