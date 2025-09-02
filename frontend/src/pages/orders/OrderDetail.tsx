import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchOrderById } from "@/state/slices/orderSlice";

export default function OrderDetail() {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const { current, status, error } = useAppSelector((s) => s.orders);
  const errorMsg =
    typeof error === "string"
      ? error
      : error
      ? ("message" in (error as any) && (error as any).message)
          || Object.values((error as any).errors ?? (error as Record<string, string>) ?? {}).join(", ")
      : "";

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id]);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <Link to="/orders">
          <Button variant="outline">Back to orders</Button>
        </Link>
      </div>

      {status === "loading" && <p className="text-gray-600">Loading...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {current && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{current.serviceType}</CardTitle>
            <Badge variant={current.status === "completed" ? "success" : current.status === "ready" ? "warning" : "secondary"}>
              {current.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
              <span className="text-gray-600">Pickup</span>
              <span>
                {new Date(current.pickupDate).toLocaleDateString()} @ {current.pickupTime}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
              <span className="text-gray-600">Delivery</span>
              <span>
                {new Date(current.deliveryDate).toLocaleDateString()} @ {current.deliveryTime}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
              <span className="text-gray-600">Items</span>
              <span>{current.garmentCount}</span>
            </div>
            {current.instructions && (
              <div className="rounded-md bg-gray-50 px-4 py-3">
                <div className="text-gray-600">Instructions</div>
                <div>{current.instructions}</div>
              </div>
            )}
            <div className="flex items-center justify-between rounded-md bg-black text-white px-4 py-3 font-medium">
              <span>Total</span>
              <span>${current.totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
