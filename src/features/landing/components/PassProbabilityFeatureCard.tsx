import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PassProbabilityFeatureCard() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Live Pass Probability
            </h2>
            <p className="text-xl text-muted-foreground">
              Watch your chances improve as you study consistently
            </p>
          </div>
          <Card className="glass-card p-12 md:p-16 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col items-center space-y-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 200 200"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="hsl(var(--muted))"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="url(#progressGradient)"
                    strokeWidth="18"
                    fill="none"
                    strokeDasharray="534"
                    strokeDashoffset="107"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl md:text-7xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    80%
                  </span>
                  <span className="text-lg text-muted-foreground mt-2">
                    Pass Chance
                  </span>
                </div>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-full border border-green-500/20">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold text-lg">
                    +12% after 3 days of consistent study
                  </span>
                </div>
                <p className="text-muted-foreground text-lg">
                  Keep going! You're on track to pass.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
