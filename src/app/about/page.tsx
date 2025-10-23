import PageHeader from "@/components/page-header";
import { generateDocumentation } from "@/ai/flows/automated-documentation-generation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Code, GitBranch, Rocket, Milestone } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion-div";

async function DocumentationSection({ topic }: { topic: string }) {
  const { documentation } = await generateDocumentation({ topic });
  const variants = {
    hidden: { opacity: 0, filter: "blur(4px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.2 }}
      variants={variants}
      viewport={{ once: true }}
    >
      <pre className="text-sm whitespace-pre-wrap font-body text-foreground/90 p-4 bg-transparent rounded-lg">
          {documentation}
      </pre>
    </MotionDiv>
  );
}

const docSections = [
    { title: "About Dynamic NFTs", topic: "A detailed explanation of Dynamic NFTs, their use cases, and their importance for the future of the metaverse.", icon: <Rocket className="h-6 w-6 text-primary" /> },
    { title: "Technology Stack", topic: "An overview of the technology stack used in EvoNFT, including the Celo blockchain, smart contracts written in Solidity, IPFS for decentralized storage, and interoperability standards like ERC-721.", icon: <Code className="h-6 w-6 text-primary" /> },
    { title: "Developer Docs", topic: "A guide for developers with API endpoints, smart contract addresses, and integration examples to build on top of the EvoNFT platform.", icon: <GitBranch className="h-6 w-6 text-primary" /> },
    { title: "Roadmap & Vision", topic: "The future plans for EvoNFT, including cross-platform NFT expansion, new evolution triggers, and community governance features.", icon: <Milestone className="h-6 w-6 text-primary" /> },
];

export default function AboutPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="About EvoNFT"
        description="Learn about the technology, philosophy, and future of Dynamic NFTs on our platform."
      />
      <div className="mt-12 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
            {docSections.map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card/50 backdrop-blur-sm border-border/40 rounded-lg px-4 hover:border-primary/50 transition-colors duration-300">
                    <AccordionTrigger className="text-lg font-headline hover:no-underline">
                        <div className="flex items-center gap-4">
                            {section.icon}
                            <span>{section.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DocumentationSection topic={section.topic} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
