import { Github, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const footerLinks = {
  ecosystem: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Mint NFT", href: "/mint" },
    { label: "My Dashboard", href: "/dashboard" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Developer Docs", href: "/about" },
    { label: "Admin", href: "/admin" },
  ],
  legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "#", name: "GitHub" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter" },
    { icon: <MessageCircle className="h-5 w-5" />, href: "#", name: "Community" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
        <div className="col-span-2 lg:col-span-1 flex flex-col items-start gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            The leading platform for minting, trading, and evolving Dynamic NFTs.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Ecosystem</h4>
          <ul className="space-y-2">
            {footerLinks.ecosystem.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold">Company</h4>
          <ul className="space-y-2">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-2">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Join our newsletter to get the latest news and updates.</p>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Email" className="bg-background"/>
                <Button type="submit">Subscribe</Button>
            </div>
        </div>
      </div>

      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-border/40">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EvoNFT. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="ghost" size="icon" asChild>
              <Link href={link.href} aria-label={link.name}>
                {link.icon}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
