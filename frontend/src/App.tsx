import { Provider } from "react-redux";
import { store } from "@/state/store";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OrdersList from "@/pages/orders/OrdersList";
import OrderCreateService from "@/pages/orders/OrderCreateService";
import OrderSchedule from "@/pages/orders/OrderSchedule";
import OrderReview from "@/pages/orders/OrderReview";
import OrderDetail from "@/pages/orders/OrderDetail";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
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
