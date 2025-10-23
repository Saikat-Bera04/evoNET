"use client";

import Image from "next/image";
import PageHeader from "@/components/page-header";
import { userProfile } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Award, Twitter, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProfileCard from "@/components/ui/ProfileCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const { walletAddress, ens, avatar, bio, achievements, crossPlatformLinks, nftHistory, ...rest } = userProfile;
  const iconUrl = PlaceHolderImages.find(p => p.id === 'nft1')?.imageUrl;
  const grainUrl = PlaceHolderImages.find(p => p.id === 'hero')?.imageUrl;


  return (
    <div className="container py-8">
      <PageHeader
        title="User Profile"
        description="Your identity in the EvoNFT ecosystem. Track your achievements and NFT journey."
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 flex justify-center">
            <ProfileCard
                avatarUrl={avatar}
                name={ens}
                title="EvoNFT Collector"
                handle={ens}
                status="Online"
                contactText="Copy Address"
                onContactClick={() => navigator.clipboard.writeText(walletAddress)}
                iconUrl={iconUrl}
                grainUrl={grainUrl}
            />
        </div>

        {/* Right Column: Achievements and History */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <Badge key={achievement} variant="secondary" className="text-lg py-1 px-3 border-primary/50 border">
                  {achievement}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NFT History Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>NFT</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Price (CELO)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nftHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className={`font-medium ${
                            item.action === 'Minted' || item.action === 'Bought' ? 'text-green-400' :
                            item.action === 'Sold' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                            {item.action}
                        </span>
                      </TableCell>
                      <TableCell>{item.nft}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">{item.price ? item.price.toFixed(2) : '---'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
