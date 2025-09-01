import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectDraft, setPickup, setInstructions } from "@/state/slices/orderSlice";

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

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"] as const;

export default function OrderSchedule() {
  const draft = useAppSelector(selectDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onContinue = () => {
    if (!draft.pickupDate || !draft.pickupTime) return alert("Please select pickup date and time");
    navigate("/orders/new/review");
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center">Book Your Service</h1>
        <p className="text-center text-gray-600">Schedule your laundry pickup in just a few steps</p>
        <Stepper step={2} />

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Schedule Pickup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date */}
            <div className="grid gap-2 max-w-xs">
              <Label htmlFor="pickupDate">Pickup Date</Label>
              <Input
                id="pickupDate"
                type="date"
                value={draft.pickupDate || ""}
                onChange={(e) => dispatch(setPickup({ date: e.target.value }))}
              />
            </div>

            {/* Time slots */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Pickup Time</div>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={draft.pickupTime === t ? "default" : "outline"}
                    onClick={() => dispatch(setPickup({ time: t }))}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label>Pickup Location</Label>
              {/* For the outline, a basic select. Replace with Places API autocomplete later. */}
              <Select
                value={draft.pickupPlaceId || ""}
                onChange={(e) => dispatch(setPickup({ placeId: e.target.value }))}
              >
                <option value="">Select a saved location</option>
                <option value="eastwood">Eastwood Heights</option>
                <option value="downtown">Downtown</option>
                <option value="midtown">Midtown</option>
              </Select>

              {/* Optional free-text detailed address */}
              <Input
                placeholder="Apartment / suite / instructions for pickup..."
                value={draft.pickupAddress || ""}
                onChange={(e) => dispatch(setPickup({ address: e.target.value }))}
              />
            </div>

            {/* Special instructions */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions for our team..."
                value={draft.instructions || ""}
                onChange={(e) => dispatch(setInstructions(e.target.value))}
              />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <Link to="/orders/new/service">
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

