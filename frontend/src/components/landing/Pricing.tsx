import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Best for small community groups and basic legal awareness.",
    features: [
      "100 Conversation Credits",
      "Regional Language Support",
      "Basic Legal FAQ Access",
    ],
    buttonText: "Start Free Trial",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$99",
    description: "Perfect for growing legal aid organizations and NGOs.",
    features: [
      "Unlimited Conversations",
      "Advanced Analytics Results",
      "Priority Support & Integration",
    ],
    buttonText: "Start Professional Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large scale public delivery and government projects.",
    features: [
      "Custom Training Models",
      "Dedicated Success Manager",
      "Advanced Data Protection",
    ],
    buttonText: "Contact Sales",
    variant: "outline" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Choose the perfect plan for your business
          </h2>
          <p className="text-muted-foreground text-lg">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-2xl scale-105 z-10" : "border-border shadow-md opacity-90"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="px-4 py-1.5 uppercase font-bold tracking-widest bg-primary">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/ month</span>}
                </div>
                <CardDescription className="pt-4">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 mt-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pb-10 pt-6">
                <Button variant={plan.variant} className="w-full h-12 text-md font-semibold" size="lg">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
