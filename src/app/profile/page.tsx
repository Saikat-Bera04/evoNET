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

export default function ProfilePage() {
  const { walletAddress, ens, avatar, bio, achievements, crossPlatformLinks, nftHistory } = userProfile;

  return (
    <div className="container py-8">
      <PageHeader
        title="User Profile"
        description="Your identity in the EvoNFT ecosystem. Track your achievements and NFT journey."
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 border-2 border-primary mb-4">
                <AvatarImage src={avatar} alt={ens} />
                <AvatarFallback>{ens.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{ens}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            <Copy className="ml-2 h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Copy Address</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{bio}</p>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <div className="flex justify-center gap-2 pt-4">
                {crossPlatformLinks.map(link => (
                    <Button key={link.platform} variant="secondary" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            {link.platform === "Twitter" ? <Twitter className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        </a>
                    </Button>
                ))}
              </div>
            </CardContent>
          </Card>
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
