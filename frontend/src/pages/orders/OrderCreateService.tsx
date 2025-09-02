import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMemo, useState } from "react";
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
  const [touched, setTouched] = useState<{ service: boolean; qty: boolean }>({ service: false, qty: false });
  const [qtyInput, setQtyInput] = useState<string>(String(draft.garmentCount || 1));

  // Inline service catalog used for the outline UI
  const services = [
    { id: "dry_cleaning", title: "Dry Cleaning", desc: "Professional cleaning for delicate fabrics", price: "$8.99/item" },
    { id: "wash_fold", title: "Wash & Fold", desc: "Fresh, clean laundry folded to perfection", price: "$2.99/lb" },
    { id: "ironing", title: "Ironing Service", desc: "Professional pressing and ironing", price: "$4.99/item" },
  ];

  // Derived validations
  const serviceValid = useMemo(() => !!draft.serviceType, [draft.serviceType]);
  const qtyValid = useMemo(() => Number(qtyInput) >= 1, [qtyInput]);
  const formValid = serviceValid && qtyValid;

  const unitLabel = () => (draft.serviceType === "wash_fold" ? "Weight (lbs)" : "Number of items");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Mark fields as touched to show errors if any
    setTouched({ service: true, qty: true });
    if (!formValid) return;
    // Commit quantity to store and proceed
    dispatch(setGarmentCount(Number(qtyInput)));
    navigate("/orders/new/schedule");
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-3xl mx-auto">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-semibold">Book Your Service</h1>
          <p className="text-muted-foreground">Schedule your laundry pickup in just a few steps</p>
        </header>
        <Stepper step={1} />

        <Card className="bg-background">
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle>Select Your Service</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Service options */}
              <fieldset className="space-y-2">
                <legend className="sr-only">Service Type</legend>
                <RadioGroup
                  value={draft.serviceType}
                  onValueChange={(val) => dispatch(setServiceType(val))}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch"
                  aria-describedby={!serviceValid && touched.service ? "service-error" : undefined}
                  onBlur={() => setTouched((t) => ({ ...t, service: true }))}
                >
                  {services.map((s) => {
                    const selected = draft.serviceType === s.id;
                    return (
                      <div key={s.id} className="relative h-full">
                        <Label
                          htmlFor={`service-${s.id}`}
                          className={
                            `text-left cursor-pointer rounded-xl border p-4 transition-colors block h-full ` +
                            (selected
                              ? "border-primary bg-accent/50"
                              : "border-input hover:bg-accent/30")
                          }
                        >
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                          <div className="text-sm mt-2">{s.price}</div>
                        </Label>
                        <RadioGroupItem
                          id={`service-${s.id}`}
                          value={s.id}
                          className="sr-only"
                          aria-invalid={!serviceValid && touched.service}
                        />
                      </div>
                    );
                  })}
                </RadioGroup>
                {!serviceValid && touched.service && (
                  <p id="service-error" className="text-xs text-destructive">Please select a service.</p>
                )}
              </fieldset>

              {/* Quantity */}
              <fieldset className="grid gap-2 max-w-xs">
                <Label htmlFor="qty">{`Enter ${unitLabel()}`}</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="e.g. 8"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={() => setTouched((t) => ({ ...t, qty: true }))}
                  aria-invalid={!qtyValid && touched.qty}
                  aria-describedby={!qtyValid && touched.qty ? "qty-error" : undefined}
                />
                {!qtyValid && touched.qty && (
                  <p id="qty-error" className="text-xs text-destructive">Please enter a value of 1 or more.</p>
                )}
              </fieldset>

              {/* Express */}
              <div className="flex items-start gap-2 select-none">
                <Checkbox id="express" checked={draft.express} onCheckedChange={(v) => dispatch(setExpress(Boolean(v)))} />
                <div>
                  <Label htmlFor="express" className="text-sm font-medium cursor-pointer">Express Service (+50% fee)</Label>
                  <div className="text-xs text-muted-foreground">Same-day or next-day delivery</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link to="/">
                  <Button variant="outline" type="button">Back</Button>
                </Link>
                <Button type="submit" disabled={!formValid}>Continue</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
