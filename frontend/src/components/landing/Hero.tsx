"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PlayCircle, MessageSquare, Gavel } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 10,000+ Citizens
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Empowering citizens through{" "}
              <span className="text-primary italic">legal voice</span>{" "}
              assistance.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Speak your concerns in your regional language. Our AI clarifies
              laws, identifies rights, and guides you to justice with ease.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold w-full sm:w-auto"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group h-14 px-8 text-lg font-semibold w-full sm:w-auto"
              >
                <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t"
            >
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  85%
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  Case Success
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  6000+
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  Interactions
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  98%
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  Group Size
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual (Chat Interface) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full lg:max-w-xl"
          >
            <ChatInterface />
          </motion.div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>
    </section>
  );
}
