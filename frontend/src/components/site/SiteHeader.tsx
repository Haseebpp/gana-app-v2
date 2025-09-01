import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { logout } from "@/state/slices/authSlice";

// Simple, responsive site header built with shadcn/ui buttons and semantic
// markup. The navigation links point to on-page sections; primary actions link
// to auth and the order flow.
export default function SiteHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  const user = useAppSelector((s) => s.auth.user);

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
              <Link to="/orders/new/service">
                <Button>Book Now</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    {/* If you later add avatar URLs, place them here */}
                    <AvatarImage src={undefined as any} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {(user?.name || user?.number || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{user?.name || "User"}</span>
                      {user?.number ? (
                        <span className="text-xs text-muted-foreground">{user.number}</span>
                      ) : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={onLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
