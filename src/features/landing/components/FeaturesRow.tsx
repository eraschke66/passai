import { Card } from "@/components/ui/card";
import { Brain, CalendarCheck, Target } from "lucide-react";

export default function FeaturesRow() {
  return (
    <section className="py-20 bg-background" id="features">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI features designed to maximize your study efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Target className="h-12 w-12" />,
              title: "Pass Probability",
              description:
                "Real-time calculation of your pass chance based on your progress, quiz scores, and study consistency.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Brain className="h-12 w-12" />,
              title: "AI Quiz Generation",
              description:
                "Unlimited practice quizzes tailored to your materials and weak areas, adapting to your progress.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: <CalendarCheck className="h-12 w-12" />,
              title: "Smart Study Plans",
              description:
                "AI-generated study schedules optimized for your test date, learning pace, and available time.",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="glass-card p-8 hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-primary/30"
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
