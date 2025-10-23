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
    label: 'Explore',
    bgColor: 'hsl(var(--secondary))',
    textColor: 'hsl(var(--secondary-foreground))',
    links: [
      { label: 'Marketplace', href: '/marketplace', ariaLabel: 'Explore the marketplace' },
      { label: 'Trending', href: '/marketplace?tab=trending', ariaLabel: 'See trending NFTs' },
    ],
  },
  {
    label: 'Create',
    bgColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--primary-foreground))',
    links: [
      { label: 'Mint an NFT', href: '/mint', ariaLabel: 'Mint a new NFT' },
      { label: 'View Your Collection', href: '/dashboard', ariaLabel: 'View your NFT dashboard' },
    ],
  },
  {
    label: 'Learn',
    bgColor: 'hsl(var(--muted))',
    textColor: 'hsl(var(--muted-foreground))',
    links: [
      { label: 'About EvoNFT', href: '/about', ariaLabel: 'Learn about EvoNFT' },
      { label: 'Our Vision', href: '/about', ariaLabel: 'Read about our vision' },
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
