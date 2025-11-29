import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Leaf,
  Sparkles,
  BarChart3,
  CalendarCheck,
  TrendingUp,
  Brain,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGetStarted = () => navigate("/login");

  return (
    <div className="min-h-screen bg-background text-foreground" id="top">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
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
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Animated Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-purple-500/10 animate-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse opacity-50" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <h1
              className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white animate-fade-in"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            >
              Know Your Pass Probability.
              <span className="block mt-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Study Smarter.
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              PassAI analyzes your progress in real-time and tells you exactly
              how likely you are to pass your test.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-lg px-8 py-6"
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

      {/* Large Pass Probability Feature Card */}
      <section className="py-20 bg-background">
        <div className="container">
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
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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

      {/* Garden Progression Section */}
      <section
        className="py-16 bg-gradient-to-b from-background to-primary/5"
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
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-lg px-8 py-6"
            >
              Start Your Growth Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Features Row */}
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
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
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

      {/* Comparison Section */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
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
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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

      {/* How It Works */}
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
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
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

      {/* Pricing */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
        id="pricing"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                features: [
                  "1 subject",
                  "Basic quizzes",
                  "Progress tracking",
                  "Community support",
                ],
              },
              {
                name: "Student",
                price: "$9.99/mo",
                popular: true,
                features: [
                  "Unlimited subjects",
                  "AI quizzes & study plans",
                  "Pass probability",
                  "Priority support",
                ],
              },
              {
                name: "Premium",
                price: "$19.99/mo",
                features: [
                  "Everything in Student",
                  "Advanced analytics",
                  "Export features",
                  "Dedicated support",
                ],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`glass-card p-8 hover:scale-105 transition-all duration-300 ${
                  plan.popular ? "border-2 border-primary shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 inline-block">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
        id="contact"
      >
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Students, parents, and schools can reach our team for support,
                questions, or feedback. We're here to help you succeed with
                PassAI.
              </p>
            </div>

            <Card className="glass-card p-10 max-w-3xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Student Support Questions
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Need help with your study plan or understanding your
                        pass probability?
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Have a feature request or suggestion for improving
                        PassAI?
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Experiencing technical issues or something not working
                        as expected?
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Questions about your subscription, billing, or account?
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>
                        Want to report a bug or provide feedback on quiz
                        quality?
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-6">
                    We typically respond within 24-48 hours. For urgent issues,
                    please include "URGENT" in your subject line.
                  </p>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                    onClick={() =>
                      (window.location.href = "mailto:passai.study@gmail.com")
                    }
                  >
                    Send a Message
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
        id="faq"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Answers to common questions about how PassAI works
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="item-1"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  How does PassAI differ from RevisionDojo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI is built around your materials and gives you a
                  real-time pass probability based on your actual progress.
                  RevisionDojo focuses on pre-made question banks, which may not
                  match your specific curriculum. PassAI adapts quizzes to your
                  weak spots and generates personalized study plans, while
                  RevisionDojo relies on community-created content that isn't
                  always aligned with your exam format or syllabus.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  How does the pass probability work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI's pass probability uses a Bayesian model that considers
                  your quiz performance, study consistency, time remaining until
                  your test, and how well you've covered the material. As you
                  take quizzes and study more, the algorithm refines its
                  estimate. It's not a magic crystal ball—it's a data-driven
                  prediction that improves with your engagement. Think of it as
                  a dynamic forecast that helps you know where you stand and
                  what you need to do to pass.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  Can I use my own study materials?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Absolutely. PassAI is designed for you to upload PDFs, lecture
                  slides, textbook excerpts, handwritten notes (via image
                  upload), or type in content directly. The AI analyzes your
                  materials to generate quizzes and summaries tailored to what
                  you're actually studying. Unlike Quizlet, which is
                  community-driven, PassAI ensures your quizzes match your
                  specific course content.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  What curricula are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI works with any curriculum because it generates content
                  from your uploaded materials. Whether you're studying for
                  A-Levels, IB, AP, GCSEs, university exams, or professional
                  certifications, PassAI adapts to your content. You're not
                  limited to pre-made question banks—upload your syllabus, and
                  PassAI will build quizzes around it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  How is my data kept private?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Your uploaded materials are stored in private, encrypted
                  storage buckets accessible only to you. PassAI doesn't share
                  your content with other users, sell it to third parties, or
                  use it to train public AI models. Processing is temporary and
                  isolated. Your progress data and quiz results are confidential
                  and will never be shared with schools or parents without your
                  explicit permission.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  Can I cancel my subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes. You can cancel your subscription at any time from your
                  account settings. If you cancel, you'll retain access to
                  premium features until the end of your current billing period.
                  After that, your account will revert to the free tier, which
                  still lets you use basic features like one subject and limited
                  quizzes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section className="py-20 bg-background" id="terms">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Terms of Service
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="terms-1"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Acceptance of Terms
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    By accessing or using PassAI, you agree to be bound by these
                    Terms of Service and all applicable laws and regulations. If
                    you do not agree with any part of these terms, you may not
                    use our service.
                  </p>
                  <p>
                    We reserve the right to modify these terms at any time.
                    Continued use of PassAI after changes are posted constitutes
                    your acceptance of the modified terms. It is your
                    responsibility to review these terms periodically.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="terms-2"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Allowed Use
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    PassAI is intended for personal educational use. You may
                    upload study materials, take quizzes, track your progress,
                    and use AI-generated study plans to prepare for exams. You
                    are encouraged to use PassAI as a supplement to your regular
                    coursework and revision.
                  </p>
                  <p>
                    You may use PassAI for individual learning, group study
                    sessions, homeschooling, tutoring, or exam preparation.
                    Schools and educational institutions may adopt PassAI for
                    classroom use with proper licensing agreements.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="terms-3"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Prohibited Behavior
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    You may not use PassAI to upload copyrighted materials that
                    you do not own or have permission to use. You may not
                    attempt to reverse-engineer, hack, or exploit PassAI's
                    systems or algorithms. Sharing account credentials, creating
                    multiple accounts to bypass usage limits, or using automated
                    bots to interact with PassAI is prohibited.
                  </p>
                  <p>
                    You may not upload illegal, harmful, or offensive content,
                    including materials that promote violence, hate speech, or
                    academic dishonesty. PassAI is not to be used for cheating
                    on exams or assessments. Misuse of the service may result in
                    account suspension or termination.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="terms-4"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  User Content
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    You retain ownership of all materials you upload to PassAI.
                    By uploading content, you grant PassAI a limited license to
                    process, analyze, and generate educational tools (such as
                    quizzes and summaries) for your personal use. This license
                    is non-exclusive and terminates when you delete your content
                    or account.
                  </p>
                  <p>
                    Your uploaded materials are stored privately and are not
                    shared with other users or third parties. PassAI processes
                    your content temporarily to generate AI features and does
                    not redistribute or repurpose your materials.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="terms-5"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Account Termination
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    PassAI reserves the right to suspend or terminate accounts
                    that violate these Terms of Service, engage in abusive
                    behavior, or use our service in ways that harm other users
                    or our systems.
                  </p>
                  <p>
                    If your account is terminated, you will lose access to all
                    stored materials and data. Users may appeal account
                    termination decisions by contacting passai.study@gmail.com.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section
        className="py-20 bg-gradient-to-b from-primary/5 to-background"
        id="privacy"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy Policy
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="privacy-1"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Data We Collect
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    PassAI collects the information you provide when creating an
                    account (email address, name), the study materials you
                    upload, your quiz responses and performance data, and usage
                    analytics to improve our service.
                  </p>
                  <p>
                    We collect technical information such as browser type, IP
                    address, and device information to ensure security and
                    optimize performance. We do not sell your personal
                    information to third parties.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="privacy-2"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  How Data Is Used
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Your data is used to provide and improve PassAI's services.
                    We analyze your uploaded materials to generate quizzes,
                    calculate pass probability, create study plans, and
                    personalize your learning experience.
                  </p>
                  <p>
                    Performance data helps us refine our algorithms and improve
                    prediction accuracy. Usage analytics guide product
                    development and help us understand which features are most
                    valuable to students.
                  </p>
                  <p>
                    We may use aggregated, anonymized data for research and to
                    improve our AI models, but individual user content and
                    performance remain private and confidential.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="privacy-3"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  What PassAI Does NOT Do
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    PassAI does not share your uploaded materials with other
                    users. We do not sell your study content or quiz responses
                    to third parties. We do not use your materials to train
                    public AI models or redistribute your content.
                  </p>
                  <p>
                    We do not track you across other websites or use invasive
                    advertising technologies. Your progress data is never shared
                    with your school, parents, or other students without your
                    explicit consent.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="privacy-4"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Data Security
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    We implement industry-standard security measures to protect
                    your data, including encryption in transit and at rest,
                    secure authentication protocols, and regular security
                    audits. Access to user data is strictly limited to
                    authorized personnel who need it to provide and improve our
                    services.
                  </p>
                  <p>
                    While we take security seriously, no system is 100% secure.
                    You are responsible for keeping your account credentials
                    confidential and notifying us immediately if you suspect
                    unauthorized access.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="privacy-5"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Your Rights
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    You have the right to access, modify, or delete your
                    personal data at any time. You can download your study
                    materials and quiz history from your account settings. You
                    can request account deletion, which will permanently remove
                    all your data from our systems within 30 days.
                  </p>
                  <p>
                    If you have questions or concerns about how your data is
                    used, contact us at passai.study@gmail.com. We are committed
                    to transparency and will respond to your inquiries promptly.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Copyright & Legal Architecture Section */}
      <section className="py-20 bg-muted/30" id="copyright">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Copyright Disclaimer
              </h2>
              <Card className="glass-card p-8 max-w-3xl mx-auto">
                <p className="text-lg text-muted-foreground mb-4 font-semibold">
                  PassAI does not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Host, distribute, or make publicly available copyrighted
                    textbooks or materials
                  </li>
                  <li>
                    Store user-uploaded files permanently or share them with
                    other users
                  </li>
                  <li>
                    Reproduce or redistribute copyrighted educational content
                  </li>
                  <li>
                    Claim ownership of any materials users upload to the
                    platform
                  </li>
                  <li>
                    Use uploaded content for purposes beyond generating
                    personalized study tools for the uploading user
                  </li>
                </ul>
              </Card>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">
                Architecture That Minimizes Legal Liability
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="arch-1"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Private File Storage
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  All uploaded materials are stored in private, user-specific
                  storage buckets. Files are never made publicly accessible and
                  are only retrievable by the account owner. Each user's content
                  is isolated and encrypted, ensuring materials cannot be
                  accessed, viewed, or downloaded by other users or third
                  parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="arch-2"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Temporary Processing
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  When you upload a file, PassAI extracts text and key concepts
                  temporarily in server memory to generate quizzes and
                  summaries. The extracted content is processed in real-time and
                  not permanently cached or stored in a form accessible to
                  others. Processing is ephemeral and limited to the scope
                  necessary to provide immediate educational value to the
                  uploading user.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="arch-3"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  No Redistribution
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI does not redistribute, resell, or share user-uploaded
                  content with other users, educational institutions, or
                  third-party services. Your materials remain yours. Quizzes
                  generated from your content are private to your account and
                  cannot be accessed by others unless you explicitly share them.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="arch-4"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  DMCA Response Workflow
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI complies with the Digital Millennium Copyright Act. If
                  you believe content uploaded by a user infringes your
                  copyright, submit a DMCA notice to passai.study@gmail.com with
                  details of the allegedly infringing content. We will
                  investigate promptly and, if valid, remove the content and
                  notify the user. Repeat copyright infringers will have their
                  accounts terminated.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="arch-5"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  No Visible Copyrighted Material
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI's interface does not display uploaded files publicly or
                  allow browsing of other users' materials. The service
                  generates derivative educational tools (quizzes, summaries,
                  progress tracking) rather than republishing copyrighted works.
                  Users cannot search for, discover, or access content uploaded
                  by others.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="arch-6"
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-xl font-bold hover:no-underline">
                  Logging & Compliance
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  PassAI maintains logs of user activity for security,
                  debugging, and compliance purposes. These logs help us
                  identify and address copyright violations, prevent abuse, and
                  respond to legal requests. We cooperate with law enforcement
                  and copyright holders when legally required, but we do not
                  proactively monitor user content or share logs without a valid
                  legal basis.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer with Section Links */}
      <footer className="border-t border-border/40 py-12 bg-gradient-to-br from-background via-primary/5 to-purple-500/5">
        <div className="container">
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
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
    </div>
  );
};
