import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchMe } from "@/state/slices/authSlice";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Homepage (marketing) replacing the previous dashboard screen.
// Built with shadcn/ui primitives and Tailwind classes for layout only.
// The structure follows your screenshots: hero → service dashboard → services
// grid → how it works → testimonial → footer.
export default function Home() {
  const { token, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  // Try to hydrate the session quietly if a token exists
  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  return (
    <div id="home" className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-14 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Professional <span className="italic">laundry</span> and dry cleaning
          <br /> at your doorstep
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Premium cleaning services with convenient pickup and delivery. Your clothes deserve the best care.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="#how">
            <Button variant="outline">How it works</Button>
          </a>
          <Link to="/orders/new/service">
            <Button>Book service now</Button>
          </Link>
        </div>
      </section>

      {/* Service Dashboard preview (cards + quick stats) */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle>Service Dashboard</CardTitle>
            <p className="text-sm text-gray-600">Track your orders and schedule new services</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Dry Cleaning", subtitle: "Professional care", price: "From $8.99" },
                { title: "Wash & Fold", subtitle: "Everyday cleaning", price: "From $2.99/lb", color: "text-green-600" },
                { title: "Express Service", subtitle: "24-hour turnaround", price: "+50% fee", color: "text-orange-500" },
              ].map((s) => (
                <Card key={s.title} className="bg-gray-50 border-gray-200">
                  <CardContent className="pt-6">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-gray-600">{s.subtitle}</div>
                    <p className={`mt-3 text-sm font-semibold ${s.color ?? "text-purple-700"}`}>{s.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-semibold">24h</div>
                <div className="text-xs text-gray-600">Avg Turnaround</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-green-600">99%</div>
                <div className="text-xs text-gray-600">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Free</div>
                <div className="text-xs text-gray-600">Pickup & Delivery</div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Badge className="cursor-default">Pickup Today 2PM</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Services grid */}
      <section id="services" aria-labelledby="services-heading" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 id="services-heading" className="text-center text-4xl md:text-5xl font-semibold">
          Complete laundry <span className="italic">solutions</span> for your lifestyle
        </h2>
        <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
          From everyday wash & fold to specialized dry cleaning, we handle all your garment care needs
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Dry Cleaning", price: "From $8.99", bullets: ["Delicate fabric care", "Stain removal", "Press & finish", "Same-day available"] },
            { title: "Wash & Fold", price: "From $2.99/lb", bullets: ["Everyday clothes", "Fresh scent", "Folded & packaged", "24-48 hour turnaround"] },
            { title: "Ironing Service", price: "From $4.99", bullets: ["Professional pressing", "Wrinkle removal", "Crisp finish", "Hanging ready"] },
            { title: "Express Service", price: "+50% fee", bullets: ["Same-day delivery", "Priority handling", "Rush orders", "Emergency service"], priceColor: "text-purple-700" },
          ].map((svc) => (
            <Card key={svc.title} className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="font-semibold">{svc.title}</div>
                <div className={`text-sm font-semibold mt-2 ${svc.priceColor ?? "text-purple-700"}`}>{svc.price}</div>
                <ul className="mt-4 text-sm text-gray-700 space-y-1">
                  {svc.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/orders/new/service">
            <Button>Book your service now</Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-4xl font-semibold">How it <span className="italic">works</span></h2>
        <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
          Simple, convenient, and reliable. Get your laundry done in just 4 easy steps.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: 1, title: "Schedule Pickup", desc: "Choose your preferred pickup time and location." },
            { step: 2, title: "We Collect", desc: "Driver arrives to collect your garments safely." },
            { step: 3, title: "Expert Cleaning", desc: "Eco-friendly processes and premium care." },
            { step: 4, title: "Fresh Delivery", desc: "Clean, pressed clothes delivered to your door." },
          ].map((i) => (
            <Card key={i.step} className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="text-xs text-gray-600">Step {i.step}</div>
                <div className="font-medium mt-1">{i.title}</div>
                <p className="text-sm text-gray-700 mt-2">{i.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA panel */}
        <Card className="mt-8 border-gray-200 bg-gray-50">
          <CardContent className="py-8 px-6 grid gap-4 md:grid-cols-2 items-center">
            <div>
              <div className="text-xl font-semibold">See it in action</div>
              <p className="text-sm text-gray-600 mt-2">
                Watch how our seamless pickup and delivery process works. From scheduling to doorstep delivery, we make laundry effortless.
              </p>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <Link to="/orders/new/service">
                <Button>Start your first order</Button>
              </Link>
              <a href="#about">
                <Button variant="outline">Learn more</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Testimonial */}
      <section id="about" className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr_320px] items-center">
            <blockquote className="text-xl md:text-2xl leading-relaxed">
              <div className="text-purple-700 mb-2">★★★★★</div>
              "GANA has been a game-changer for our busy family. The pickup and delivery service is incredibly convenient, and our clothes always come back looking perfect. Their attention to detail is outstanding."
              <footer className="mt-4 text-sm text-gray-600">
                <div className="font-medium text-gray-900">Sarah Williams</div>
                Marketing Director, Regular Customer
              </footer>
            </blockquote>
            {/* Placeholder image block. Replace with actual image as needed. */}
            <div className="aspect-square rounded-xl bg-gray-100" />
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 pb-10">
        <p className="text-center text-sm text-gray-600">
          Have questions? Reach us at <a className="underline" href="mailto:support@gana.com">support@gana.com</a>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
