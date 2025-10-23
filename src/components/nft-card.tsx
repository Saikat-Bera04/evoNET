import Image from 'next/image';
import Link from 'next/link';
import { Nft } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface NftCardProps {
  nft: Nft;
  showLink?: boolean;
}

const rarityColors: { [key: string]: string } = {
    'Common': 'bg-gray-500',
    'Uncommon': 'bg-green-500',
    'Rare': 'bg-blue-500',
    'Mythic': 'bg-purple-600',
    'Legendary': 'bg-amber-500',
}

export default function NftCard({ nft, showLink = true }: NftCardProps) {
  const evolutionProgress = (nft.evolution.stage / nft.evolution.maxStage) * 100;

  return (
    <Card className="overflow-hidden bg-card/70 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={nft.image.src}
            alt={nft.name}
            data-ai-hint={nft.image.hint}
            width={nft.image.width}
            height={nft.image.height}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {showLink && (
             <Link href={`/evolve/${nft.id}`} className="absolute inset-0" aria-label={`View ${nft.name}`} />
          )}
          <Badge className={`absolute top-2 left-2 ${rarityColors[nft.attributes.rarity]}`}>
            {nft.attributes.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
         <CardTitle className="text-lg font-bold truncate">
            {showLink ? (
                <Link href={`/evolve/${nft.id}`} className="hover:text-primary transition-colors">{nft.name}</Link>
            ) : (
                nft.name
            )}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{nft.description}</p>
        
        <div className="pt-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                <span>Evolution</span>
                <span>Stage {nft.evolution.stage} / {nft.evolution.maxStage}</span>
            </div>
            <Progress value={evolutionProgress} className="h-2"/>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="font-bold text-lg text-primary">{nft.price} {nft.currency}</p>
        </div>
        <Button size="sm" asChild className="font-bold">
            {showLink ? (
                <Link href={`/marketplace`}>Buy Now <ArrowUpRight className="h-4 w-4 ml-2"/></Link>
            ) : (
                <Link href={`/evolve/${nft.id}`}>Interact <ArrowUpRight className="h-4 w-4 ml-2"/></Link>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
}
