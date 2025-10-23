'use server';
/**
 * @fileOverview A personalized NFT recommendation AI agent.
 *
 * - recommendNfts - A function that provides personalized NFT recommendations based on user data.
 * - RecommendNftsInput - The input type for the recommendNfts function.
 * - RecommendNftsOutput - The return type for the recommendNfts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNftsInputSchema = z.object({
  userProfile: z.string().describe('The user profile data including interests and preferences.'),
  walletData: z.string().describe('The user wallet data showing owned NFTs and transaction history.'),
  activityHistory: z.string().describe('The user activity history on the platform.'),
  newNftReleases: z.string().describe('The recent NFT releases and collection information.'),
});
export type RecommendNftsInput = z.infer<typeof RecommendNftsInputSchema>;

const RecommendNftsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      nftName: z.string().describe('The name of the recommended NFT.'),
      nftDescription: z.string().describe('A brief description of the NFT.'),
      reason: z.string().describe('The reason why this NFT is recommended for the user.'),
    })
  ).describe('A list of personalized NFT recommendations.'),
});
export type RecommendNftsOutput = z.infer<typeof RecommendNftsOutputSchema>;

export async function recommendNfts(input: RecommendNftsInput): Promise<RecommendNftsOutput> {
  return recommendNftsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNftsPrompt',
  input: {schema: RecommendNftsInputSchema},
  output: {schema: RecommendNftsOutputSchema},
  prompt: `You are an expert NFT recommendation engine. You analyze user profiles, wallet data, activity history, and recent NFT releases to provide personalized NFT recommendations.

Analyze the following user data:

User Profile: {{{userProfile}}}
Wallet Data: {{{walletData}}}
Activity History: {{{activityHistory}}}
Recent NFT Releases: {{{newNftReleases}}}

Based on this information, provide a list of NFT recommendations tailored to the user's interests and investment strategy. Explain the reason for each recommendation.

Format your response as a JSON array of NFT recommendations.

{
  "recommendations": [
    {
      "nftName": "",
      "nftDescription": "",
      "reason": ""
    }
  ]
}`,
});

const recommendNftsFlow = ai.defineFlow(
  {
    name: 'recommendNftsFlow',
    inputSchema: RecommendNftsInputSchema,
    outputSchema: RecommendNftsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
