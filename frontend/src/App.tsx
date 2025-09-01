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

function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAppSelector((s) => Boolean(s.auth.token));
  return isAuthed ? <Navigate to="/" replace /> : children;
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <PublicOnlyRoute><Login /></PublicOnlyRoute> },
  { path: "/register", element: <PublicOnlyRoute><Register /></PublicOnlyRoute> },
  // --- Orders ---
  { path: "/orders", element: <OrdersList /> },
  { path: "/orders/new/service", element: <OrderCreateService /> },
  { path: "/orders/new/schedule", element: <OrderSchedule /> },
  { path: "/orders/new/review", element: <OrderReview /> },
  { path: "/orders/:id", element: <OrderDetail /> },
]);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
