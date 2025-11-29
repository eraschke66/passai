export default function Footer({
  scrollToId,
}: {
  scrollToId: (id: string) => void;
}) {
  return (
    <footer className="border-t border-border/40 py-12 bg-linear-to-br from-background via-primary/5 to-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
              >
                <defs>
                  <linearGradient
                    id="footerMainGradient"
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
                    id="footerAccentGradient"
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

                  <filter id="footerGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M 100 60 L 160 80 L 160 95 L 100 115 L 40 95 L 40 80 Z"
                  fill="url(#footerMainGradient)"
                  opacity="0.9"
                />

                <path
                  d="M 50 70 L 150 55 L 155 65 L 55 80 Z"
                  fill="url(#footerMainGradient)"
                />

                <circle
                  cx="100"
                  cy="130"
                  r="6"
                  fill="url(#footerAccentGradient)"
                  filter="url(#footerGlow)"
                />
                <circle
                  cx="75"
                  cy="145"
                  r="5"
                  fill="url(#footerAccentGradient)"
                  filter="url(#footerGlow)"
                />
                <circle
                  cx="125"
                  cy="145"
                  r="5"
                  fill="url(#footerAccentGradient)"
                  filter="url(#footerGlow)"
                />
                <circle
                  cx="85"
                  cy="160"
                  r="4"
                  fill="url(#footerAccentGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="115"
                  cy="160"
                  r="4"
                  fill="url(#footerAccentGradient)"
                  opacity="0.8"
                />

                <line
                  x1="100"
                  y1="130"
                  x2="75"
                  y2="145"
                  stroke="url(#footerAccentGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="100"
                  y1="130"
                  x2="125"
                  y2="145"
                  stroke="url(#footerAccentGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="75"
                  y1="145"
                  x2="85"
                  y2="160"
                  stroke="url(#footerAccentGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="125"
                  y1="145"
                  x2="115"
                  y2="160"
                  stroke="url(#footerAccentGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />

                <g transform="translate(145, 50)">
                  <path
                    d="M 0 0 L 3 8 L -3 5 L -1 12 L -5 8 L 0 0"
                    fill="url(#footerAccentGradient)"
                    filter="url(#footerGlow)"
                  />
                </g>

                <line
                  x1="155"
                  y1="65"
                  x2="165"
                  y2="90"
                  stroke="url(#footerMainGradient)"
                  strokeWidth="2"
                />
                <circle
                  cx="165"
                  cy="93"
                  r="5"
                  fill="url(#footerAccentGradient)"
                  filter="url(#footerGlow)"
                />
              </svg>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PassAI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Study smarter with AI-powered pass probability and adaptive
              learning.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => scrollToId("how-it-works")}
                  className="hover:text-primary transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("pricing")}
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("faq")}
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => scrollToId("terms")}
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("privacy")}
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("copyright")}
                  className="hover:text-primary transition-colors"
                >
                  Copyright
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => scrollToId("contact")}
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 PassAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
