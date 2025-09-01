import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Checkbox from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectDraft, setServiceType, setGarmentCount, setExpress } from "@/state/slices/orderSlice";

// Step indicator used by all order create pages
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

export default function OrderCreateService() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const draft = useAppSelector(selectDraft);

  // Inline service catalog used for the outline UI
  const services = [
    { id: "dry_cleaning", title: "Dry Cleaning", desc: "Professional cleaning for delicate fabrics", price: "$8.99/item" },
    { id: "wash_fold", title: "Wash & Fold", desc: "Fresh, clean laundry folded to perfection", price: "$2.99/lb" },
    { id: "ironing", title: "Ironing Service", desc: "Professional pressing and ironing", price: "$4.99/item" },
  ];

  const onContinue = () => {
    // Minimal guard to guide the outline flow
    if (!draft.serviceType) return alert("Please select a service type");
    navigate("/orders/new/schedule");
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center">Book Your Service</h1>
        <p className="text-center text-gray-600">Schedule your laundry pickup in just a few steps</p>
        <Stepper step={1} />

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Select Your Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service options (cards act as radio group) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => dispatch(setServiceType(s.id))}
                  className={
                    "text-left rounded-xl border p-4 transition-colors " +
                    (draft.serviceType === s.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50")
                  }
                  aria-pressed={draft.serviceType === s.id}
                >
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{s.desc}</div>
                  <div className="text-sm mt-2 text-gray-900">{s.price}</div>
                </button>
              ))}
            </div>

            {/* Quantity */}
            <div className="grid gap-2 max-w-xs">
              <Label htmlFor="qty">Number of items/weight (lbs)</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                value={draft.garmentCount}
                onChange={(e) => dispatch(setGarmentCount(Number(e.target.value)))}
              />
            </div>

            {/* Express checkbox */}
            <label className="flex items-start gap-2 select-none">
              <Checkbox
                checked={draft.express}
                onChange={(e) => dispatch(setExpress((e.target as HTMLInputElement).checked))}
              />
              <div>
                <div className="text-sm font-medium">Express Service (+50% fee)</div>
                <div className="text-xs text-gray-600">Same-day or next-day delivery</div>
              </div>
            </label>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <Link to="/">
                <Button variant="outline">Back</Button>
              </Link>
              <Button onClick={onContinue}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

