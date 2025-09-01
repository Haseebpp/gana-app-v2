import { useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchMyOrders } from "@/state/slices/orderSlice";

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    // Load user's orders on first mount.
    if (status === "idle") dispatch(fetchMyOrders(undefined));
  }, []);

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <Link to="/orders/new/service">
          <Button>New Order</Button>
        </Link>
      </div>

      {status === "loading" && <p className="text-gray-600">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-3">
        {items.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="block">
            <Card className="hover:bg-gray-50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{o.serviceType}</CardTitle>
                <Badge variant={o.status === "completed" ? "success" : o.status === "ready" ? "warning" : "secondary"}>
                  {o.status}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 flex gap-6">
                <div>
                  <div className="text-gray-500">Pickup</div>
                  <div>
                    {new Date(o.pickupDate).toLocaleDateString()} @ {o.pickupTime}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Items</div>
                  <div>{o.garmentCount}</div>
                </div>
                <div className="ml-auto font-medium">${o.totalPrice.toFixed(2)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {items.length === 0 && status !== "loading" && (
          <Card>
            <CardContent className="py-6 text-gray-600">No orders yet.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

