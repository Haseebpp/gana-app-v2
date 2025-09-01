import { Provider } from "react-redux";
import { store, useAppSelector } from "@/state/store";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OrdersList from "@/pages/orders/OrdersList";
import OrderCreateService from "@/pages/orders/OrderCreateService";
import OrderSchedule from "@/pages/orders/OrderSchedule";
import OrderReview from "@/pages/orders/OrderReview";
import OrderDetail from "@/pages/orders/OrderDetail";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ProfileCard from "@/pages/profile/ProfileCard";
import ProfileEdit from "@/pages/profile/ProfileEdit";

function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  return isAuthed ? <Navigate to="/" replace /> : children;
}

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-dvh flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      {children}
    </main>
    <SiteFooter />
  </div>
);

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  return isAuthed ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <AppLayout><Home /></AppLayout> },
  { path: "/login", element: <AppLayout><PublicOnlyRoute><Login /></PublicOnlyRoute></AppLayout> },
  { path: "/register", element: <AppLayout><PublicOnlyRoute><Register /></PublicOnlyRoute></AppLayout> },
  // --- Orders ---
  { path: "/orders", element: <AppLayout><OrdersList /></AppLayout> },
  { path: "/orders/new/service", element: <AppLayout><OrderCreateService /></AppLayout> },
  { path: "/orders/new/schedule", element: <AppLayout><OrderSchedule /></AppLayout> },
  { path: "/orders/new/review", element: <AppLayout><OrderReview /></AppLayout> },
  { path: "/orders/:id", element: <AppLayout><OrderDetail /></AppLayout> },
  // --- Profile ---
  { path: "/profile", element: <AppLayout><ProtectedRoute><ProfileCard /></ProtectedRoute></AppLayout> },
  { path: "/profile/edit", element: <AppLayout><ProtectedRoute><ProfileEdit /></ProtectedRoute></AppLayout> },
]);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
