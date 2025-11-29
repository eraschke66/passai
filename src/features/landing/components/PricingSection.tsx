import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection({
  handleGetStarted,
}: {
  handleGetStarted: () => void;
}) {
  return (
    <section
      className="py-20 bg-linear-to-b from-primary/5 to-background"
      id="pricing"
    >
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Starter",
              price: "Free",
              features: [
                "1 subject",
                "Basic quizzes",
                "Progress tracking",
                "Community support",
              ],
            },
            {
              name: "Student",
              price: "$9.99/mo",
              popular: true,
              features: [
                "Unlimited subjects",
                "AI quizzes & study plans",
                "Pass probability",
                "Priority support",
              ],
            },
            {
              name: "Premium",
              price: "$19.99/mo",
              features: [
                "Everything in Student",
                "Advanced analytics",
                "Export features",
                "Dedicated support",
              ],
            },
          ].map((plan, i) => (
            <Card
              key={i}
              className={`glass-card p-8 hover:scale-105 transition-all duration-300 ${
                plan.popular ? "border-2 border-primary shadow-xl" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-linear-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 inline-block">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6 bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {plan.price}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-linear-to-r from-primary to-purple-600 hover:opacity-90"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
