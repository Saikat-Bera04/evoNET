import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import CardNav from '@/components/CardNav';
import GridDistortion from '@/components/grid-distortion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TargetCursor from '@/components/ui/arrow-cursor';


export const metadata: Metadata = {
  title: 'EvoNFT - Evolving NFTs for the Connected Metaverse',
  description: 'Mint, trade, and evolve dynamic NFTs on the Celo blockchain.',
};

const navItems = [
  {
    label: 'Ecosystem',
    bgColor: 'hsl(0 0% 100%)',
    textColor: 'hsl(0 0% 0%)',
    links: [
      { label: 'Home', href: '/', ariaLabel: 'Go to the homepage' },
      { label: 'Marketplace', href: '/marketplace', ariaLabel: 'Explore the marketplace' },
      { label: 'Mint an NFT', href: '/mint', ariaLabel: 'Mint a new NFT' },
    ],
  },
  {
    label: 'My Collection',
    bgColor: 'hsl(0 0% 0%)',
    textColor: 'hsl(0 0% 100%)',
    links: [
        { label: 'Dashboard', href: '/dashboard', ariaLabel: 'View your NFT dashboard' },
        { label: 'Profile', href: '/profile', ariaLabel: 'View your user profile' },
        { label: 'Evolve', href: '/evolve/1', ariaLabel: 'Evolve an NFT'},
    ],
  },
  {
    label: 'About',
    bgColor: 'hsl(0 0% 100%)',
    textColor: 'hsl(0 0% 0%)',
    links: [
        { label: 'About EvoNFT', href: '/about', ariaLabel: 'Learn about EvoNFT' },
        { label: 'Admin', href: '/admin', ariaLabel: 'Go to the admin portal' },
    ],
  }
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')} suppressHydrationWarning>
        {heroImage && (
          <GridDistortion 
            imageSrc={heroImage.imageUrl} 
            className="fixed inset-0 z-0 opacity-20"
          />
        )}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <CardNav 
            items={navItems}
            baseColor='hsl(0 0% 100%)'
            menuColor='hsl(0 0% 0%)'
            buttonBgColor='hsl(0 0% 90%)'
            buttonTextColor='hsl(0 0% 0%)'
        />
        <div className="relative z-10 flex min-h-screen flex-col pt-24">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <TargetCursor />
      </body>
    </html>
  );
}
