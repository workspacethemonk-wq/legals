import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { MessageSquare, Globe, Users, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "Natural Language Understanding",
    description: "Advanced NLP allows users to talk freely, capturing nuances in local dialects and legal jargon effortlessly.",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Multi-Channel Support",
    description: "Seamlessly handle conversations across email, chat, social media, and phone with a unified AI brain.",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Smart Human Hand-off",
    description: "Automatically escalate complex cases to human legal experts with full AI-generated context.",
    icon: <Users className="h-6 w-6" />,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Advanced Analytics",
    description: "Deep insights into citizen satisfaction, response times, and emerging legal trends in your region.",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-orange-500/10 text-orange-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything you need for exceptional legal support
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform combines cutting-edge technology with intuitive design to transform your judicial experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl leading-tight">{feature.title}</CardTitle>
                <CardDescription className="text-sm pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Integration Callout */}
        <div className="mt-24 p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-4">
              <h3 className="text-2xl md:text-4xl font-bold">Connect with your existing tools</h3>
              <p className="text-primary-foreground/80 max-w-xl">
                Integrate with 100+ popular platforms and tools. Set up in mere minutes with our premium connectors.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Globe className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
}
