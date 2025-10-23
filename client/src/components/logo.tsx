import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
    <div className={cn("font-headline text-2xl font-bold", className)}>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            EvoNFT
        </span>
    </div>
);

export default Logo;
