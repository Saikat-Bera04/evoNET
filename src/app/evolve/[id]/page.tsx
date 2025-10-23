import Image from "next/image";
import { nfts } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, Milestone, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function EvolvePage({ params }: { params: { id: string } }) {
  const nft = nfts.find((n) => n.id === params.id);

  if (!nft) {
    notFound();
  }

  const evolutionProgress = (nft.evolution.stage / nft.evolution.maxStage) * 100;
  const evolutionRules = [
    { rule: "Reach Level 25", complete: nft.attributes.level >= 25 },
    { rule: "Participate in 10 marketplace trades", complete: true },
    { rule: "Sync with a real-world weather event", complete: false },
  ];

  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left Column: NFT Image */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24">
            <div className="relative aspect-[3/4]">
              <Image
                src={nft.image.src}
                alt={nft.name}
                data-ai-hint={nft.image.hint}
                width={nft.image.width}
                height={nft.image.height}
                className="object-cover"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-3 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{nft.attributes.type}</Badge>
              <Badge>{nft.attributes.rarity}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mt-2">{nft.name}</h1>
            <p className="text-muted-foreground mt-2">{nft.description}</p>
          </div>
          
          {/* Attributes */}
          <Card>
            <CardHeader><CardTitle>Attributes</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{nft.attributes.level}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="text-2xl font-bold">{nft.attributes.type}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Rarity</p>
                <p className="text-2xl font-bold">{nft.attributes.rarity}</p>
              </div>
            </CardContent>
          </Card>

          {/* Evolution Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Evolution to Stage {nft.evolution.stage + 1}</CardTitle>
              <CardDescription>Complete the following conditions to unlock the next evolution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="pt-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                        <span>Evolution Progress</span>
                        <span>Stage {nft.evolution.stage} / {nft.evolution.maxStage}</span>
                    </div>
                    <Progress value={evolutionProgress} className="h-3"/>
                </div>
                <Separator/>
              {evolutionRules.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.complete ? <Check className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-muted-foreground" />}
                    <span className={item.complete ? "text-foreground" : "text-muted-foreground"}>{item.rule}</span>
                  </div>
                  {item.complete && <Badge variant="secondary">Complete</Badge>}
                </div>
              ))}
              <Button size="lg" className="w-full font-bold" disabled={!evolutionRules.every(r => r.complete)}>
                Evolve Now <Zap className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Evolution History */}
          <Card>
            <CardHeader><CardTitle>Evolution History</CardTitle></CardHeader>
            <CardContent>
              <div className="relative pl-6">
                <div className="absolute left-[30px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                {nft.evolution.history.map((evo, index) => (
                  <div key={index} className="relative mb-8 flex items-start gap-6">
                    <div className="absolute left-[30px] top-1.5 h-4 w-4 rounded-full bg-primary -translate-x-1/2 border-4 border-background"></div>
                    <div className="flex-shrink-0">
                        <Milestone className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Stage {evo.stage}: {evo.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(evo.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
