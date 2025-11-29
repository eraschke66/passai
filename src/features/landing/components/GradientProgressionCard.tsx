import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";

export default function GradientProgressionCard({
  handleGetStarted,
}: {
  handleGetStarted: () => void;
}) {
  return (
    <section
      className="py-16 bg-linear-to-b from-background to-primary/5"
      id="garden"
    >
      <div className="container">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Leaf className="h-10 w-10 text-green-500" />
              Your Knowledge Garden
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch your understanding grow from seed to mastery. Each topic
              blooms as you learn.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              {
                emoji: "🌳",
                label: "Mastered",
                color: "text-green-600",
                desc: "Complete understanding",
              },
              {
                emoji: "🌻",
                label: "Strong",
                color: "text-yellow-600",
                desc: "Solid knowledge",
              },
              {
                emoji: "🌿",
                label: "Growing",
                color: "text-lime-600",
                desc: "Making progress",
              },
              {
                emoji: "🌱",
                label: "Sprouting",
                color: "text-emerald-600",
                desc: "Just started",
              },
              {
                emoji: "💧",
                label: "Needs Water",
                color: "text-blue-600",
                desc: "Time to review",
              },
            ].map((stage, i) => (
              <Card
                key={i}
                className="glass-card p-6 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 filter group-hover:saturate-150">
                  {stage.emoji}
                </div>
                <h3 className={`font-semibold text-lg ${stage.color} mb-1`}>
                  {stage.label}
                </h3>
                <p className="text-sm text-muted-foreground">{stage.desc}</p>
              </Card>
            ))}
          </div>

          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-linear-to-r from-green-600 to-emerald-600 hover:opacity-90 text-lg px-8 py-6"
          >
            Start Your Growth Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
