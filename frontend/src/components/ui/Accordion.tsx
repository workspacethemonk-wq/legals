"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
));
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const AccordionItem = ({ title, children, className }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("border rounded-xl overflow-hidden bg-muted/20", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left font-semibold hover:bg-muted/30 transition-all"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 pt-0 text-muted-foreground leading-relaxed text-sm md:text-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Accordion, AccordionItem };
