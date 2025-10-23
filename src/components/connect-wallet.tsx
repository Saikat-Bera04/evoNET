"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

export default function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      toast({
        title: "Wallet Disconnected",
        description: "You have successfully disconnected your Celo wallet.",
      });
    } else {
      // Placeholder for actual wallet connection logic (e.g., with Celo Wallet)
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Your Celo wallet (0x12...aBcd) has been connected.",
      });
    }
  };

  return (
    <Button onClick={handleConnect} variant={isConnected ? "secondary" : "default"} className="font-bold">
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected ? "Disconnect" : "Connect Wallet"}
    </Button>
  );
}
