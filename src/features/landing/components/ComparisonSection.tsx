import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section
      className="py-20 bg-linear-to-b from-primary/5 to-background"
      id="comparison"
    >
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How PassAI Compares
            </h2>
            <p className="text-xl text-muted-foreground">
              See how we stack up against the competition
            </p>
          </div>

          <Card className="glass-card overflow-hidden border-2 border-primary/20 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-6 font-bold text-lg min-w-[200px]">
                      Feature
                    </th>
                    <th className="text-center p-6 font-bold text-lg bg-primary/10 min-w-[140px]">
                      <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        PassAI
                      </span>
                    </th>
                    <th className="text-center p-6 text-muted-foreground min-w-[140px]">
                      RevisionDojo
                    </th>
                    <th className="text-center p-6 text-muted-foreground min-w-[140px]">
                      Quizlet
                    </th>
                    <th className="text-center p-6 text-muted-foreground min-w-[140px]">
                      Mindgrasp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Pass Probability",
                      passai: "AI-powered predictions",
                      revisiondojo: false,
                      quizlet: false,
                      mindgrasp: false,
                    },
                    {
                      feature: "Upload Your Own Materials",
                      passai: "From your documents + source tracking",
                      revisiondojo: false,
                      quizlet: "Community flashcards only",
                      mindgrasp: "Limited formats",
                    },
                    {
                      feature: "AI Quiz Generation",
                      passai: "Unlimited adaptive quizzes",
                      revisiondojo: "Pre-made only",
                      quizlet: false,
                      mindgrasp: "Basic summaries",
                    },
                    {
                      feature: "Progress Visualization",
                      passai: "Garden growth metaphor 🌱",
                      revisiondojo: "Basic stats",
                      quizlet: "Simple charts",
                      mindgrasp: false,
                    },
                    {
                      feature: "Smart Study Plans",
                      passai: "AI-optimized schedules",
                      revisiondojo: false,
                      quizlet: false,
                      mindgrasp: false,
                    },
                    {
                      feature: "Test Date Integration",
                      passai: "Countdown + adaptive planning",
                      revisiondojo: false,
                      quizlet: false,
                      mindgrasp: false,
                    },
                    {
                      feature: "Privacy",
                      passai: "Private storage, no sharing",
                      revisiondojo: "Community sharing",
                      quizlet: "Public by default",
                      mindgrasp: "Terms unclear",
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${
                        i % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="p-6 font-medium">{row.feature}</td>
                      <td className="text-center p-6 bg-primary/5">
                        {typeof row.passai === "string" ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                            <span className="text-sm text-muted-foreground">
                              {row.passai}
                            </span>
                          </div>
                        ) : (
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-6">
                        {typeof row.revisiondojo === "string" ? (
                          <span className="text-sm text-muted-foreground">
                            {row.revisiondojo}
                          </span>
                        ) : row.revisiondojo ? (
                          <CheckCircle2 className="h-6 w-6 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-2xl text-red-500">✗</span>
                        )}
                      </td>
                      <td className="text-center p-6">
                        {typeof row.quizlet === "string" ? (
                          <span className="text-sm text-muted-foreground">
                            {row.quizlet}
                          </span>
                        ) : row.quizlet ? (
                          <CheckCircle2 className="h-6 w-6 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-2xl text-red-500">✗</span>
                        )}
                      </td>
                      <td className="text-center p-6">
                        {typeof row.mindgrasp === "string" ? (
                          <span className="text-sm text-muted-foreground">
                            {row.mindgrasp}
                          </span>
                        ) : row.mindgrasp ? (
                          <CheckCircle2 className="h-6 w-6 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-2xl text-red-500">✗</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
