import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectDraft, selectDraftPricing } from "@/state/slices/orderSlice";

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const base = "h-8 w-8 grid place-items-center rounded-full border";
  const Dot = ({ n }: { n: number }) => (
    <div
      className={
        n <= step
          ? `${base} bg-black text-white border-black`
          : `${base} bg-white text-gray-600 border-gray-300`
      }
    >
      {n}
    </div>
  );
  return (
    <div className="flex items-center gap-4 justify-center py-6">
      <Dot n={1} />
      <div className="h-0.5 w-10 bg-gray-300" />
      <Dot n={2} />
      <div className="h-0.5 w-10 bg-gray-300" />
      <Dot n={3} />
    </div>
  );
}

export default function OrderReview() {
  const draft = useAppSelector(selectDraft);
  const prices = useAppSelector(selectDraftPricing);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const confirm = async () => {
    // For the outline, we only validate presence of a few draft fields.
    if (!draft.serviceType || !draft.garmentCount || !draft.pickupDate || !draft.pickupTime) {
      return alert("Please complete previous steps");
    }

    // This is where you would map the draft to a CreateOrderPayload and
    // dispatch the createOrder thunk. We keep it as a guided TODO.
    // Example:
    // await dispatch(createOrder({ ...mappedPayload }))

    alert("Order confirmed (outline). Integrate API call next.");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center">Book Your Service</h1>
        <p className="text-center text-gray-600">Schedule your laundry pickup in just a few steps</p>
        <Stepper step={3} />

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Review Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium capitalize">{draft.serviceType.replace("_", " ") || "—"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{draft.garmentCount || 1} item</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
                <span className="text-gray-600">Pickup:</span>
                <span className="font-medium">{draft.pickupDate || "—"} at {draft.pickupTime || "—"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{draft.pickupPlaceId || draft.pickupAddress || "—"}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span>${prices.subtotal.toFixed(2)}</span>
              </div>
              {draft.express && (
                <div className="bg-gray-50 px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Express fee:</span>
                  <span>${prices.expressFee.toFixed(2)}</span>
                </div>
              )}
              <div className="bg-gray-50 px-4 py-2 flex justify-between">
                <span className="text-gray-700">Delivery fee:</span>
                <span>${prices.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="bg-black text-white px-4 py-3 flex justify-between font-medium">
                <span>Total:</span>
                <span>${prices.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link to="/orders/new/schedule">
                <Button variant="outline">Back</Button>
              </Link>
              <Button onClick={confirm}>Confirm Order</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

