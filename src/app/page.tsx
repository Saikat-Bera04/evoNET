import { Button } from "@/components/ui/magic-border-button";
import NftCard from "@/components/nft-card";
import { nfts } from "@/lib/data";
import { ArrowRight, Bot, IterationCw, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from "@/components/ui/masonry";
import { ExpandableCardDemo } from "@/components/ui/expandable-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import BlurText from "@/components/ui/blur-text";

const features = [
  {
    quote: "Watch your NFTs change and grow based on real-world events and interactions.",
    name: "Real-Time Evolution",
    title: "Dynamic Core",
    icon: <IterationCw className="h-8 w-8" />,
  },
  {
    quote: "Seamlessly move your dynamic NFTs across different metaverses and platforms.",
    name: "Interoperability",
    title: "Cross-Platform",
    icon: <Sparkles className="h-8 w-8" />,
  },
    {
    quote: "Built on Celo, ensuring true ownership and security for your digital assets.",
    name: "Decentralization",
    title: "Secure & Owned",
    icon: <Bot className="h-8 w-8" />,
  },
  {
    quote: "Trade and collect evolving NFTs in a vibrant and active marketplace.",
    name: "Marketplace Integration",
    title: "Vibrant Economy",
    icon: <ShoppingCart className="h-8 w-8" />,
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const masonryItems = nfts.map(nft => ({
    id: nft.id,
    imageUrl: nft.image.src,
    imageHint: nft.image.hint,
    url: `/evolve/${nft.id}`,
    name: nft.name,
  }));

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
        {/* The gradient overlay is also in the main layout */}

        <div className="container px-4 md:px-6 z-10 flex flex-col items-center">
          <div className="font-headline text-3xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  EvoNFT
              </span>
          </div>
          <BlurText
            text="Evolving NFTs for the Connected Metaverse"
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
            animateBy="words"
          />
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
            Experience the next generation of digital collectibles. Mint, trade, and evolve NFTs that live, breathe, and change with you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/mint">Mint Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="w-full py-12 md:py-24 lg:py-32 container">
        <Masonry
          items={masonryItems}
          columns={3}
          gap={24}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={1.05}
          blurToFocus={false}
          colorShiftOnHover={false}
        />
      </section>

      <section id="what-are-dnfts" className="w-full py-12 md:py-24 lg:py-32 bg-background/80 backdrop-blur-sm">
        <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">Dynamic NFTs</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">What Are Dynamic NFTs?</h2>
            <p className="max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Unlike static JPEGs, Dynamic NFTs (dNFTs) are digital assets that can change their properties, appearance, or metadata over time. This evolution is driven by external data, user interactions, or predefined rules within their smart contracts, making them truly living collectibles.
            </p>
          </div>
          <div className="flex justify-center">
             <Card className="w-full max-w-md border-2 border-primary/50 shadow-primary/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  <span>Anatomy of a dNFT</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/90">
                <div className="p-3 bg-muted/50 rounded-lg"><strong>Base Layer:</strong> The core NFT with its unique identifier on the Celo blockchain.</div>
                <div className="p-3 bg-muted/50 rounded-lg"><strong>Metadata Layer:</strong> Dynamic data stored on IPFS that can be updated.</div>
                <div className="p-3 bg-muted/50 rounded-lg"><strong>Logic Layer:</strong> Smart contract rules that define how and when the NFT evolves.</div>
                <div className="p-3 bg-muted/50 rounded-lg"><strong>Data Layer:</strong> Oracles and APIs that feed real-world information to trigger changes.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Key Features of EvoNFT</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides the tools and infrastructure to create, manage, and trade the next generation of NFTs.
              </p>
            </div>
          </div>
           <div className="mt-12">
            <InfiniteMovingCards
                items={features}
                direction="right"
                speed="slow"
            />
           </div>
        </div>
      </section>
      
      <section id="trending" className="w-full py-12 md:py-24 lg:py-32 bg-background/80 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 font-headline">Trending NFTs</h2>
          <ExpandableCardDemo />
        </div>
      </section>
    </div>
  );
}
