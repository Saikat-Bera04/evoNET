'use server';

/**
 * @fileOverview Automatically generates documentation, guides, and educational materials about Dynamic NFTs.
 *
 * - generateDocumentation - A function that generates documentation based on the provided topic.
 * - GenerateDocumentationInput - The input type for the generateDocumentation function.
 * - GenerateDocumentationOutput - The return type for the generateDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentationInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The topic for which documentation should be generated. Examples: Dynamic NFTs, platform technology, future plans.'
    ),
});
export type GenerateDocumentationInput = z.infer<typeof GenerateDocumentationInputSchema>;

const GenerateDocumentationOutputSchema = z.object({
  documentation: z
    .string()
    .describe('The generated documentation for the specified topic.'),
});
export type GenerateDocumentationOutput = z.infer<typeof GenerateDocumentationOutputSchema>;

export async function generateDocumentation(
  input: GenerateDocumentationInput
): Promise<GenerateDocumentationOutput> {
  return generateDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentationPrompt',
  input: {schema: GenerateDocumentationInputSchema},
  output: {schema: GenerateDocumentationOutputSchema},
  prompt: `You are an AI documentation generator for EvoNFT, a platform for Dynamic NFTs.

  Generate comprehensive documentation for the following topic:

  Topic: {{{topic}}}

  The documentation should be clear, concise, and easy to understand for both developers and end-users.
  Include explanations, examples, and use cases where appropriate.
  The output should be well-formatted and ready to be included in a documentation website or guide.
  Consider using Markdown formatting for headings, lists, and code examples.
  Do not respond as if you are a chatbot, instead write it as documentation, which will be used to create an About/Docs page.
  Ensure the output has complete sentences and no grammatical errors.
  Make it easy for end users or developers to copy and paste your responses for their own use.
  `,
});

const generateDocumentationFlow = ai.defineFlow(
  {
    name: 'generateDocumentationFlow',
    inputSchema: GenerateDocumentationInputSchema,
    outputSchema: GenerateDocumentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

