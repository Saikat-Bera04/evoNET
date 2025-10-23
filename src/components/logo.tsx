import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <svg
    width="100"
    height="28"
    viewBox="0 0 100 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-primary", className)}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M2.5 2.5V25.5"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 14H14.5L26.5 2.5V25.5"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38.5 25.5C44.5 25.5 48.5 20.5 48.5 14C48.5 7.5 44.5 2.5 38.5 2.5C32.5 2.5 28.5 7.5 28.5 14C28.5 20.5 32.5 25.5 38.5 25.5Z"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.5 14H63.5L75.5 2.5V25.5"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M78.5 2.5V25.5"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M78.5 2.5L88.5 14H97.5"
      stroke="url(#logo-gradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
