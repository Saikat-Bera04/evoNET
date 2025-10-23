import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import LiquidEther from '@/components/liquid-ether';
import CardNav from '@/components/CardNav';

export const metadata: Metadata = {
  title: 'EvoNFT - Evolving NFTs for the Connected Metaverse',
  description: 'Mint, trade, and evolve dynamic NFTs on the Celo blockchain.',
};

const navItems = [
  {
    label: 'Ecosystem',
    bgColor: 'hsl(var(--secondary))',
    textColor: 'hsl(var(--secondary-foreground))',
    links: [
      { label: 'Home', href: '/', ariaLabel: 'Go to the homepage' },
      { label: 'Marketplace', href: '/marketplace', ariaLabel: 'Explore the marketplace' },
      { label: 'Mint an NFT', href: '/mint', ariaLabel: 'Mint a new NFT' },
      { label: 'About EvoNFT', href: '/about', ariaLabel: 'Learn about EvoNFT' },
    ],
  },
  {
    label: 'My Collection',
    bgColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--primary-foreground))',
    links: [
        { label: 'Dashboard', href: '/dashboard', ariaLabel: 'View your NFT dashboard' },
        { label: 'Profile', href: '/profile', ariaLabel: 'View your user profile' },
        { label: 'Admin', href: '/admin', ariaLabel: 'Go to the admin portal' },
    ],
  },
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <LiquidEther className="fixed inset-0 z-0" />
        <CardNav items={navItems} />
        <div className="relative z-10 flex min-h-screen flex-col pt-24">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
