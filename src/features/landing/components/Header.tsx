import { Button } from "@/components/ui/button";

export default function Header({
  scrollToId,
  handleGetStarted,
}: {
  scrollToId: (id: string) => void;
  handleGetStarted: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => scrollToId("top")}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
          >
            <defs>
              <linearGradient
                id="mainGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#2563EB", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#9333EA", stopOpacity: 1 }}
                />
              </linearGradient>

              <linearGradient
                id="accentGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#60A5FA", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#A78BFA", stopOpacity: 1 }}
                />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M 100 60 L 160 80 L 160 95 L 100 115 L 40 95 L 40 80 Z"
              fill="url(#mainGradient)"
              opacity="0.9"
            />

            <path
              d="M 50 70 L 150 55 L 155 65 L 55 80 Z"
              fill="url(#mainGradient)"
            />

            <circle
              cx="100"
              cy="130"
              r="6"
              fill="url(#accentGradient)"
              filter="url(#glow)"
            />
            <circle
              cx="75"
              cy="145"
              r="5"
              fill="url(#accentGradient)"
              filter="url(#glow)"
            />
            <circle
              cx="125"
              cy="145"
              r="5"
              fill="url(#accentGradient)"
              filter="url(#glow)"
            />
            <circle
              cx="85"
              cy="160"
              r="4"
              fill="url(#accentGradient)"
              opacity="0.8"
            />
            <circle
              cx="115"
              cy="160"
              r="4"
              fill="url(#accentGradient)"
              opacity="0.8"
            />

            <line
              x1="100"
              y1="130"
              x2="75"
              y2="145"
              stroke="url(#accentGradient)"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="100"
              y1="130"
              x2="125"
              y2="145"
              stroke="url(#accentGradient)"
              strokeWidth="2"
              opacity="0.6"
            />
            <line
              x1="75"
              y1="145"
              x2="85"
              y2="160"
              stroke="url(#accentGradient)"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="125"
              y1="145"
              x2="115"
              y2="160"
              stroke="url(#accentGradient)"
              strokeWidth="1.5"
              opacity="0.5"
            />

            <g transform="translate(145, 50)">
              <path
                d="M 0 0 L 3 8 L -3 5 L -1 12 L -5 8 L 0 0"
                fill="url(#accentGradient)"
                filter="url(#glow)"
              />
            </g>

            <line
              x1="155"
              y1="65"
              x2="165"
              y2="90"
              stroke="url(#mainGradient)"
              strokeWidth="2"
            />
            <circle
              cx="165"
              cy="93"
              r="5"
              fill="url(#accentGradient)"
              filter="url(#glow)"
            />
          </svg>
          <span className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            PassAI
          </span>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToId("features")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToId("how-it-works")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToId("pricing")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToId("faq")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            FAQ
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleGetStarted}>
            Log in
          </Button>
          <Button
            onClick={handleGetStarted}
            className="bg-linear-to-r from-primary to-purple-600 hover:opacity-90"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
