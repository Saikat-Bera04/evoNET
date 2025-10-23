"use client";

import { useState, useEffect, useMemo } from "react";
import NftCard from "@/components/nft-card";
import PageHeader from "@/components/page-header";
import { nfts as allNfts, userProfile, type Nft } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recommendNfts, RecommendNftsOutput } from "@/ai/flows/personalized-nft-recommendations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function NFTGrid({ nfts }: { nfts: Nft[] | null }) {
  if (!nfts) {
     return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="p-0">
                        <Skeleton className="w-full aspect-[3/4]" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4">
                            <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
  }
  
  if (nfts.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg col-span-full">
        <p className="text-muted-foreground">No NFTs found.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}

function Recommendations() {
    const [recommendations, setRecommendations] = useState<RecommendNftsOutput['recommendations'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                const mockInput = {
                    userProfile: JSON.stringify({ interests: ['Cosmic', 'Mythical'], style: 'dark fantasy' }),
                    walletData: "Owns: Cosmic Wanderer. Sold: Quantum Golem.",
                    activityHistory: "Frequently views 'Cybernetic' and 'Abstract' type NFTs.",
                    newNftReleases: JSON.stringify(allNfts.slice(4,6).map(n => ({name: n.name, description: n.description}))),
                };
                const result = await recommendNfts(mockInput);
                setRecommendations(result.recommendations);
            } catch (e) {
                console.error(e);
                setError("Failed to fetch AI recommendations. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        getRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-3/5" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-full mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive text-center">{error}</p>
    }

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations?.map((rec, i) => (
                <Card key={i} className="bg-gradient-to-br from-card to-accent/20 border-accent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Sparkles className="text-primary w-5 h-5"/> {rec.nftName}
                        </CardTitle>
                        <CardDescription>{rec.nftDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">"{rec.reason}"</p>
                    </CardContent>
                </Card>
            ))}
         </div>
    );
}

export default function MarketplacePage() {
  const [nfts, setNfts] = useState<Nft[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");

  useEffect(() => {
    // Set NFTs on the client to avoid hydration issues with random data
    setNfts(allNfts);
  }, []);

  const filteredNfts = useMemo(() => {
    if (!nfts) return null;
    return nfts.filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = rarityFilter === "all" || nft.attributes.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [nfts, searchTerm, rarityFilter]);

  const trendingNfts = useMemo(() => {
    if (!filteredNfts) return null;
    return filteredNfts.slice().sort((a,b) => b.price - a.price).slice(0,4);
  }, [filteredNfts]);

  return (
    <div className="container py-8">
      <PageHeader
        title="NFT Marketplace"
        description="Discover, collect, and trade the most innovative Dynamic NFTs in the metaverse."
      />

      <div className="mt-8">
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <TabsList>
              <TabsTrigger value="all">All NFTs</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recommended">
                <Sparkles className="mr-2 h-4 w-4 text-primary" /> Recommended
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-4">
              <Input
                placeholder="Search NFTs..."
                className="w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Uncommon">Uncommon</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Mythic">Mythic</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="all">
            <NFTGrid nfts={filteredNfts} />
          </TabsContent>
          <TabsContent value="trending">
            <NFTGrid nfts={trendingNfts} />
          </TabsContent>
          <TabsContent value="recommended">
            <Recommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
