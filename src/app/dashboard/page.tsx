"use client"

import { useState, useEffect } from "react";
import NftCard from "@/components/nft-card";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nfts } from "@/lib/data";
import { LayoutGrid, List, BarChart, Check, AlertCircle } from "lucide-react";

type Stat = {
    title: string;
    value: number;
    icon: React.ReactNode;
};

export default function DashboardPage() {
    const myNfts = nfts.slice(0,4); // Simulate owning 4 NFTs
    const [searchTerm, setSearchTerm] = useState("");
    const [rarityFilter, setRarityFilter] = useState("all");
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        const evolvedNfts = myNfts.filter(nft => nft.evolution.stage > 1).length;
        
        const initialStats: Stat[] = [
            { title: "Total NFTs", value: myNfts.length, icon: <LayoutGrid className="h-6 w-6" /> },
            { title: "Evolved NFTs", value: evolvedNfts, icon: <BarChart className="h-6 w-6" /> },
            { title: "Ready to Evolve", value: 1, icon: <Check className="h-6 w-6" /> },
            { title: "Pending Updates", value: 0, icon: <AlertCircle className="h-6 w-6" /> },
        ];
        setStats(initialStats);
    }, [myNfts]);

    const filteredNfts = myNfts.filter(nft => {
        const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRarity = rarityFilter === 'all' || nft.attributes.rarity === rarityFilter;
        return matchesSearch && matchesRarity;
    });

    return (
        <div className="container py-8">
            <PageHeader 
                title="My NFT Dashboard"
                description="Manage your collection, track evolution progress, and interact with your dynamic assets."
            />
            
            <section className="mt-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map(stat => (
                         <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className="text-muted-foreground">{stat.icon}</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section className="mt-12">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Input 
                        placeholder="Filter NFTs by name..." 
                        className="max-w-sm"
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
                
                {filteredNfts.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredNfts.map(nft => (
                            <NftCard key={nft.id} nft={nft} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
                        <p className="text-muted-foreground">No NFTs match your filters.</p>
                    </div>
                )}

            </section>
        </div>
    )
}
