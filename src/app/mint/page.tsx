

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/magic-border-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NftCard from "@/components/nft-card";
import { nfts, userProfile } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/page-header";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(50),
  description: z.string().min(10, "Description must be at least 10 characters.").max(200),
  image: z.any().refine((file) => file?.length == 1, "Image is required."),
  type: z.string().min(1, "Type is required."),
  level: z.coerce.number().min(1, "Level must be at least 1."),
  rarity: z.enum(["Common", "Uncommon", "Rare", "Mythic", "Legendary"]),
});

export default function MintPage() {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mintedNftId, setMintedNftId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "Cosmic",
      level: 1,
      rarity: "Common",
    },
  });

  const watchedValues = form.watch();

  const previewNft = {
    ...nfts[0], // Use a base structure
    id: 'preview',
    name: watchedValues.name || "My Awesome NFT",
    description: watchedValues.description || "A description of my new creation.",
    image: { src: watchedValues.image ? URL.createObjectURL(watchedValues.image[0]) : nfts[0].image.src, hint: 'preview', width: 600, height: 800 },
    creator: { name: userProfile.ens, avatar: userProfile.avatar, wallet: userProfile.walletAddress },
    owner: { name: userProfile.ens, avatar: userProfile.avatar, wallet: userProfile.walletAddress },
    price: 0,
    attributes: {
      type: watchedValues.type,
      level: watchedValues.level,
      rarity: watchedValues.rarity,
    },
    evolution: {
        ...nfts[0].evolution,
        stage: 1,
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Minting with values:", values);
    toast({
      title: "Minting Transaction Sent",
      description: "Please confirm the transaction in your Celo wallet.",
    });

    // Simulate minting delay and confirmation
    setTimeout(() => {
      setMintedNftId("new-nft-id"); // In a real app, this would be the ID from the contract event
      setShowConfirmation(true);
      form.reset();
    }, 3000);
  }

  return (
    <>
      <div className="container py-8">
        <PageHeader 
          title="Mint a Dynamic NFT"
          description="Bring your creation to life. Define its core attributes and mint it on the Celo blockchain."
        />

        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">NFT Details</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NFT Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cosmic Wanderer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your unique creation..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Upload (IPFS-backed)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                      </FormControl>
                      <FormDescription>Your image will be pinned to IPFS.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cosmic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="rarity"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Rarity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select a rarity" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {["Common", "Uncommon", "Rare", "Mythic", "Legendary"].map(rarity => (
                                      <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full font-bold" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Minting..." : "Mint NFT"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center lg:text-left">NFT Preview</h3>
            <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-sm">
                    <NftCard nft={previewNft} showLink={false} />
                </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mint Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Congratulations! Your Dynamic NFT has been successfully minted to the Celo blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
                <Link href={`/evolve/${mintedNftId}`}>View My NFT</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
