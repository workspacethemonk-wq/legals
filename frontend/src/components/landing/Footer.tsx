import Link from "next/link";
import { Gavel, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Integrations", href: "#integrations" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status Page", href: "#" },
      { name: "Security", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Gavel className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Sahayak AI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Transforming the legal experience in India through voice-first, AI-driven tools. Ensure harmony where voice meets the power of the law.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          <p>© 2026 Sahayak AI. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Security</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
