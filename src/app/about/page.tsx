import PageHeader from "@/components/page-header";
import { generateDocumentation } from "@/ai/flows/automated-documentation-generation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, GitBranch, Rocket, Milestone } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion-div";

async function DocumentationSection({ title, topic }: { title: string; topic: string }) {
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
    { title: "About Dynamic NFTs", topic: "A detailed explanation of Dynamic NFTs, their use cases, and their importance for the future of the metaverse.", icon: <Rocket className="h-8 w-8 text-primary" /> },
    { title: "Technology Stack", topic: "An overview of the technology stack used in EvoNFT, including the Celo blockchain, smart contracts written in Solidity, IPFS for decentralized storage, and interoperability standards like ERC-721.", icon: <Code className="h-8 w-8 text-primary" /> },
    { title: "Developer Docs", topic: "A guide for developers with API endpoints, smart contract addresses, and integration examples to build on top of the EvoNFT platform.", icon: <GitBranch className="h-8 w-8 text-primary" /> },
    { title: "Roadmap & Vision", topic: "The future plans for EvoNFT, including cross-platform NFT expansion, new evolution triggers, and community governance features.", icon: <Milestone className="h-8 w-8 text-primary" /> },
];

export default function AboutPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="About EvoNFT"
        description="Learn about the technology, philosophy, and future of Dynamic NFTs on our platform."
      />
      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {docSections.map((section, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                        {section.icon}
                        <span className="text-2xl font-headline">{section.title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DocumentationSection title={section.title} topic={section.topic} />
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
