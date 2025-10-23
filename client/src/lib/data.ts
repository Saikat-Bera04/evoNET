import { PlaceHolderImages } from './placeholder-images';

type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Mythic' | 'Legendary';
const rarities: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Legendary'];

export type NftEvolution = {
  stage: number;
  date: string;
  description: string;
};

export type Nft = {
  id: string;
  name: string;
  description: string;
  image: {
    src: string;
    hint: string;
    width: number;
    height: number;
  };
  creator: {
    name: string;
    avatar: string;
    wallet: string;
  };
  owner: {
    name: string;
    avatar: string;
    wallet: string;
  };
  price: number;
  currency: 'CELO';
  attributes: {
    type: string;
    level: number;
    rarity: Rarity;
  };
  evolution: {
    stage: number;
    maxStage: number;
    history: NftEvolution[];
  };
};

const creators = [
  { name: '0xCypher', avatar: 'https://picsum.photos/seed/creator1/100/100', wallet: '0x1234...abcd' },
  { name: 'Metatron', avatar: 'https://picsum.photos/seed/creator2/100/100', wallet: '0x5678...efgh' },
  { name: 'GlitchArt', avatar: 'https://picsum.photos/seed/creator3/100/100', wallet: '0x9012...ijkl' },
];

const owners = [
  { name: 'You', avatar: 'https://picsum.photos/seed/owner1/100/100', wallet: '0xYOU...wallet' },
  { name: 'NFTCollector22', avatar: 'https://picsum.photos/seed/owner2/100/100', wallet: '0xABCD...1234' },
  { name: 'CryptoKing', avatar: 'https://picsum.photos/seed/owner3/100/100', wallet: '0xEFGH...5678' },
];

const nftData = [
  {
    id: '1',
    name: 'Cosmic Wanderer',
    description: "An entity born from a supernova, its form shifts with the cosmic radiation it absorbs. Currently in its 'Nebula' phase.",
    type: 'Cosmic',
  },
  {
    id: '2',
    name: 'Chrono-Dragon',
    description: "A mythical beast whose scales reflect different eras of time. It ages both forwards and backwards.",
    type: 'Mythical',
  },
  {
    id: '3',
    name: 'Quantum Golem',
    description: "A construct of pure data and light, its armor reconfigures based on network traffic. It is currently at 'Idle' state.",
    type: 'Cybernetic',
  },
  {
    id: '4',
    name: 'Ethereal Bloom',
    description: "A spectral flower that blooms in response to the seasons of the digital world. Now in its 'Spring' form.",
    type: 'Spirit',
  },
  {
    id: '5',
    name: 'Data-Stream Serpent',
    description: "A sentient visualization of the Celo blockchain's transaction flow. Its length and color change with market activity.",
    type: 'Abstract',
  },
  {
    id: '6',
    name: 'Metropolis Unfolding',
    description: "A living miniature city that builds itself over time, reflecting the growth of the EvoNFT community.",
    type: 'Architectural',
  },
];

export const nfts: Nft[] = nftData.map((item, index) => {
  const placeholder = PlaceHolderImages.find(p => p.id === `nft${index + 1}`)!;
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    image: {
      src: placeholder.imageUrl,
      hint: placeholder.imageHint,
      width: 600,
      height: 800,
    },
    creator: creators[index % creators.length],
    owner: owners[index % owners.length],
    price: parseFloat((Math.random() * (100 - 5) + 5).toFixed(2)),
    currency: 'CELO',
    attributes: {
      type: item.type,
      level: Math.floor(Math.random() * 20) + 1,
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
    },
    evolution: {
      stage: Math.floor(Math.random() * 4) + 1,
      maxStage: 5,
      history: [
        { stage: 1, date: '2024-01-15', description: 'Minted' },
        { stage: 2, date: '2024-03-22', description: 'Evolved after 100 transactions' },
      ].slice(0, Math.floor(Math.random() * 2) + 1),
    },
  };
});

export const userProfile = {
  walletAddress: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  ens: "evonft.user",
  avatar: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '',
  bio: "Collector of rare digital artifacts and a believer in the living metaverse. Exploring the frontiers of dNFTs.",
  achievements: [
    "First Mint",
    "Evo-Master",
    "Top Trader",
    "Community Pillar",
  ],
  crossPlatformLinks: [
    { platform: "Twitter", handle: "@evouser" },
    { platform: "Decentraland", handle: "EvoUser#1234" },
  ],
  nftHistory: [
    { action: "Minted", nft: "Cosmic Wanderer", date: "2024-01-15", price: 5.0 },
    { action: "Sold", nft: "Quantum Golem", date: "2024-02-20", price: 25.5 },
    { action: "Evolved", nft: "Cosmic Wanderer", date: "2024-03-22", details: "Stage 2" },
    { action: "Bought", nft: "Ethereal Bloom", date: "2024-04-10", price: 15.2 },
  ]
}

export type UserProfile = typeof userProfile;
