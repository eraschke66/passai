import { Button } from "@/components/ui/button";

export default function AnimatedGradientHero({
  handleGetStarted,
  scrollToId,
}: {
  handleGetStarted: () => void;
  scrollToId: (id: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-primary/5 to-purple-500/10 animate-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse opacity-50" />
      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white animate-fade-in"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
          >
            Know Your Pass Probability.
            <span className="block mt-2 bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Study Smarter.
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            PassAI analyzes your progress in real-time and tells you exactly how
            likely you are to pass your test.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-linear-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6"
            >
              Start Free Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToId("how-it-works")}
              className="text-lg px-8 py-6"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
