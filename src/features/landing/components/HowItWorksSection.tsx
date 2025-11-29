export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-background" id="how-it-works">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Upload Your Materials",
                description:
                  "Import PDFs, notes, slides, or type directly. PassAI analyzes everything instantly.",
              },
              {
                step: "2",
                title: "Take AI-Generated Quizzes",
                description:
                  "Practice with unlimited quizzes tailored to your content and areas that need improvement.",
              },
              {
                step: "3",
                title: "Track Your Progress",
                description:
                  "Watch your pass probability rise as you study. Follow AI-generated study plans optimized for your test date.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="shrink-0 w-16 h-16 rounded-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
