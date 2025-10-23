import { Github, Twitter, MessageCircle } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, href: "#", name: "GitHub" },
  { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter" },
  { icon: <MessageCircle className="h-5 w-5" />, href: "#", name: "Community" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by EvoNFT. The source for Dynamic NFTs.
          </p>
        </div>
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
