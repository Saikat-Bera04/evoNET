import PageHeader from "@/components/page-header";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function AboutPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="About Dynamic NFTs"
        description="Understanding Dynamic NFTs: the evolving future of digital assets and the metaverse"
      />

      <div className="mt-8 max-w-4xl mx-auto">
        <Accordion type="single" collapsible defaultValue="intro">
          <AccordionItem value="intro">
            <AccordionTrigger>Introduction to Dynamic NFTs</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Non-Fungible Tokens (NFTs) have revolutionized digital ownership, providing verifiable proof of authenticity and
                scarcity for digital assets. Traditionally, NFTs have been static, meaning their associated metadata and visual
                representation remain unchanged after minting. However, a new paradigm is emerging: <strong>Dynamic NFTs (dNFTs)</strong>.
                Dynamic NFTs are a more advanced form of NFT whose characteristics, metadata, or visual appearance can change over time
                based on external conditions, smart contract logic, or owner interactions.
              </p>

              <p className="text-muted-foreground mt-2">
                Unlike static NFTs, dNFTs possess the ability to evolve. This evolution can be triggered by various factors, such as
                real-world events, game progress, data from external APIs, or the passage of time. This introduces a layer of
                interactivity and utility previously unattainable with static digital assets.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how">
            <AccordionTrigger>How Dynamic NFTs Work</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                The core of a Dynamic NFT lies in its smart contract and the way it manages metadata. Instead of pointing to an
                immutable JSON file on IPFS or similar storage, a dNFT's metadata can be designed to reference on-chain data,
                interact with external data sources (oracles), or respond to user actions.
              </p>

              <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                <li><strong>Reference on-chain data:</strong> smart contracts may store parameters that determine attributes and can be updated by contract functions.</li>
                <li><strong>Interact with oracles:</strong> external data like weather, sports scores, or market data can influence state.</li>
                <li><strong>Respond to user actions:</strong> leveling up, participation, or other interactions can change appearance or functionality.</li>
              </ul>

              <p className="text-muted-foreground mt-2">
                When a dNFT's state changes, the smart contract updates its metadata which is then reflected in marketplaces and
                applications. For example, an in-game sword could gain power and change its artwork as the player wins battles.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="characteristics">
            <AccordionTrigger>Key Characteristics of Dynamic NFTs</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li><strong>Evolvability:</strong> ability to change and adapt over time.</li>
                <li><strong>Interactivity:</strong> respond to external stimuli, user actions, or predefined conditions.</li>
                <li><strong>Utility-driven:</strong> designed with specific functionality beyond collectibles.</li>
                <li><strong>Real-time relevance:</strong> reflect current data, events, or progress.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="use-cases">
            <AccordionTrigger>Use Cases for Dynamic NFTs</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Dynamic NFTs enable many applications across industries including gaming, identity, RWAs (real-world assets), art,
                and membership programs. Examples include evolving game characters, dynamic badges, product tracking, interactive
                artworks, and tiered membership NFTs that upgrade visually or functionally.
              </p>

              <ol className="list-decimal pl-5 mt-2 text-muted-foreground">
                <li><strong>Gaming & Metaverse Avatars:</strong> evolving characters and personalized avatars based on activity and ownership.</li>
                <li><strong>Digital Identity:</strong> dynamic badges or reputation NFTs that update with achievements or qualifications.</li>
                <li><strong>RWAs & Supply Chain:</strong> NFTs linked to physical products that update ownership, service history, or environmental data.</li>
                <li><strong>Art & Collectibles:</strong> interactive art that changes with external inputs or community votes.</li>
                <li><strong>Membership & Loyalty:</strong> NFTs that unlock or upgrade benefits based on user behavior.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="importance">
            <AccordionTrigger>Importance for the Metaverse</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Dynamic NFTs are fundamental to immersive virtual worlds. They enhance user experience and immersion by enabling
                lifelike, interactive assets (e.g., digital pets or evolving homes). They also advance true ownership and
                interoperability — assets can carry their history and state across environments — and enable new digital economy
                models where evolved assets can have changing value.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tech">
            <AccordionTrigger>Technology Stack</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-medium">Celo Blockchain</h3>
              <p className="text-muted-foreground mt-2">
                EvoNFT leverages Celo — a mobile-first, carbon-negative, EVM-compatible chain — for low fees, mobile access, and
                eco-friendly operations.
              </p>

              <h3 className="text-lg font-medium mt-3">Solidity Smart Contracts</h3>
              <p className="text-muted-foreground mt-2">
                Smart contracts define evolution mechanics, attribute management, and access controls. The ERC-721 standard is used
                for interoperability while custom logic supports mutable attributes and tokenURI resolution.
              </p>

              <h3 className="text-lg font-medium mt-3">IPFS</h3>
              <p className="text-muted-foreground mt-2">
                IPFS stores media and metadata for EvoNFTs. When NFTs evolve, contracts update pointers (CIDs) to new metadata
                files stored on IPFS, ensuring decentralization and immutability of each state snapshot.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="developer-docs">
            <AccordionTrigger>Developer Docs</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Developers should be familiar with Web3 tooling (Hardhat/Foundry), Node.js, and wallet integrations. EvoNFT exposes
                APIs for off-chain management, event feeding, and querying of NFT state. Authentication is typically via API keys and
                on-chain interactions are performed through standard libraries.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="roadmap">
            <AccordionTrigger>Roadmap & Vision</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                EvoNFT plans to expand cross-platform interoperability (multi-chain), introduce advanced evolution triggers (oracles,
                AI-driven events, on-chain interactions), and implement community governance (DAO) features to empower holders.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
