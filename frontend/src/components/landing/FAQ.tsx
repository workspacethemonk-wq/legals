import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-md leading-tight">
              Everything else you need to know about Sahayak AI.
            </h2>
            
            <div className="p-8 rounded-3xl bg-background border flex flex-col gap-6 shadow-sm">
              <h3 className="text-xl font-bold">How do you protect against legal data inaccuracy?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our AI is built on a retrieval-augmented generation (RAG) architecture, ensuring every answer is verified against the latest judicial notifications and official BNS documentation. No hallucinations, just facts.
              </p>
              <Button variant="link" className="p-0 h-auto justify-start group">
                Learn more about our technology
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Right Content - Accordion */}
          <Accordion className="w-full">
            <AccordionItem title="How does AI guard against evolving legal changes?">
              Our automated data pipeline polls official gazettes daily. When a new legal amendment is detected, the vector database is updated in real-time, ensuring Sahayak always operates on the most current laws.
            </AccordionItem>
            <AccordionItem title="Can I change my plans at any time?">
              Yes, you can upgrade, downgrade, or cancel your subscription at any time through the dashboard. All changes are prorated to your billing cycle.
            </AccordionItem>
            <AccordionItem title="Do you offer custom enterprise solutions?">
              Absolutely. We provide on-premise deployments, custom model training on your internal legal documents, and dedicated API throughput for high-volume government and corporate projects.
            </AccordionItem>
            <AccordionItem title="Is there any setup fee?">
              There are no hidden setup fees for our Starter and Professional plans. For Enterprise deployments requiring custom integrations, we provide a transparent, one-time implementation quote.
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
