import PageHeader from "@/components/page-header";
import { generateDocumentation } from "@/ai/flows/automated-documentation-generation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Code, GitBranch, Rocket, Milestone } from "lucide-react";

async function DocumentationSection({ title, topic }: { title: string; topic: string }) {
  const { documentation } = await generateDocumentation({ topic });
  return (
    <pre className="text-sm whitespace-pre-wrap font-body text-foreground/90 p-6 bg-muted/50 rounded-lg">
        {documentation}
    </pre>
  );
}

const docSections = [
    { title: "About Dynamic NFTs", topic: "A detailed explanation of Dynamic NFTs, their use cases, and their importance for the future of the metaverse.", icon: <Rocket className="mr-2" /> },
    { title: "Technology Stack", topic: "An overview of the technology stack used in EvoNFT, including the Celo blockchain, smart contracts written in Solidity, IPFS for decentralized storage, and interoperability standards like ERC-721.", icon: <Code className="mr-2" /> },
    { title: "Developer Docs", topic: "A guide for developers with API endpoints, smart contract addresses, and integration examples to build on top of the EvoNFT platform.", icon: <GitBranch className="mr-2" /> },
    { title: "Roadmap & Vision", topic: "The future plans for EvoNFT, including cross-platform NFT expansion, new evolution triggers, and community governance features.", icon: <Milestone className="mr-2" /> },
];

export default function AboutPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="About EvoNFT"
        description="Learn about the technology, philosophy, and future of Dynamic NFTs on our platform."
      />
      <div className="mt-12 max-w-4xl mx-auto">
        <Accordion type="single" collapsible defaultValue="item-0">
          {docSections.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-xl font-headline hover:no-underline">
                <div className="flex items-center">
                    {section.icon}
                    {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <DocumentationSection title={section.title} topic={section.topic} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
