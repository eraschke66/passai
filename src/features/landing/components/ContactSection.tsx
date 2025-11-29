import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      className="py-20 bg-linear-to-b from-primary/5 to-background"
      id="contact"
    >
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h2>
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
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>
                      Need help with your study plan or understanding your pass
                      probability?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>
                      Have a feature request or suggestion for improving PassAI?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>
                      Experiencing technical issues or something not working as
                      expected?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>
                      Questions about your subscription, billing, or account?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>
                      Want to report a bug or provide feedback on quiz quality?
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
                  className="w-full bg-linear-to-r from-primary to-purple-600 hover:opacity-90"
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
  );
}
