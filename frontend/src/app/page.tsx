import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Partner Logos Placeholder Section */}
        <section className="py-12 border-y bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {["LEGAL-DB", "NITI AAYOG", "JUSTICE-GO", "RIGHTS+", "CIVIC-LY"].map((partner) => (
                <span key={partner} className="text-xl md:text-2xl font-black tracking-tighter">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Features />
        
        {/* Call to Action Section */}
        <section className="py-24 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to transform your judicial experience?
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Join thousands of citizens and legal professionals using Sahayak AI to simplify complex laws and protect their rights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                Get Started for Free
              </button>
              <button className="border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                Book a Consultation
              </button>
            </div>
          </div>
        </section>

        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
