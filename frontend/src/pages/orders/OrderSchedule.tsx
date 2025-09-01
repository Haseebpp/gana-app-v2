import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { selectDraft, setPickup, setDelivery, setInstructions } from "@/state/slices/orderSlice";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
    // Validate pickup
    if (!draft.pickupDate || !draft.pickupTime) return alert("Please select pickup date and time");
    if (!draft.pickupPlaceId) return alert("Please select a pickup location");

    // Validate delivery (required by backend)
    if (!draft.deliveryDate || !draft.deliveryTime) return alert("Please select delivery date and time");
    if (!draft.deliveryPlaceId) return alert("Please select a delivery location");

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
            <div className="grid gap-2">
              <Label>Pickup Date</Label>
              <div className="rounded-md border p-3 w-fit">
                <Calendar
                  mode="single"
                  selected={draft.pickupDate ? new Date(draft.pickupDate) : undefined}
                  onSelect={(d) =>
                    dispatch(setPickup({ date: d ? format(d, "yyyy-MM-dd") : undefined }))
                  }
                  captionLayout="dropdown"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 2}
                />
              </div>
              {draft.pickupDate ? (
                <span className="text-sm text-muted-foreground">
                  Selected: {format(new Date(draft.pickupDate), "EEE, MMM d, yyyy")}
                </span>
              ) : null}
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

            {/* Pickup Location */}
            <div className="grid gap-2">
              <Label>Pickup Location</Label>
              {/* For the outline, a basic select. Replace with Places API autocomplete later. */}
              <Select
                value={draft.pickupPlaceId || undefined}
                onValueChange={(v) => dispatch(setPickup({ placeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eastwood">Eastwood Heights</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="midtown">Midtown</SelectItem>
                </SelectContent>
              </Select>

              {/* Optional free-text detailed address */}
              <Input
                placeholder="Apartment / suite / instructions for pickup..."
                value={draft.pickupAddress || ""}
                onChange={(e) => dispatch(setPickup({ address: e.target.value }))}
              />
            </div>

            {/* Delivery scheduling */}
            <div className="grid gap-2">
              <Label>Delivery Date</Label>
              <div className="rounded-md border p-3 w-fit">
                <Calendar
                  mode="single"
                  selected={draft.deliveryDate ? new Date(draft.deliveryDate) : undefined}
                  onSelect={(d) =>
                    dispatch(setDelivery({ date: d ? format(d, "yyyy-MM-dd") : undefined }))
                  }
                  captionLayout="dropdown"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 2}
                />
              </div>
              {draft.deliveryDate ? (
                <span className="text-sm text-muted-foreground">
                  Selected: {format(new Date(draft.deliveryDate), "EEE, MMM d, yyyy")}
                </span>
              ) : null}
            </div>

            {/* Delivery Time slots */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Delivery Time</div>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={draft.deliveryTime === t ? "default" : "outline"}
                    onClick={() => dispatch(setDelivery({ time: t }))}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            {/* Delivery Location */}
            <div className="grid gap-2">
              <Label>Delivery Location</Label>
              <Select
                value={draft.deliveryPlaceId || undefined}
                onValueChange={(v) => dispatch(setDelivery({ placeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eastwood">Eastwood Heights</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="midtown">Midtown</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Delivery address / instructions..."
                value={draft.deliveryAddress || ""}
                onChange={(e) => dispatch(setDelivery({ address: e.target.value }))}
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

