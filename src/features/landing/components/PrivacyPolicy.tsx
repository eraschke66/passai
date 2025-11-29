import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PrivacyPolicy() {
  return (
    <section
      className="py-20 bg-linear-to-b from-primary/5 to-background"
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
                  account (email address, name), the study materials you upload,
                  your quiz responses and performance data, and usage analytics
                  to improve our service.
                </p>
                <p>
                  We collect technical information such as browser type, IP
                  address, and device information to ensure security and
                  optimize performance. We do not sell your personal information
                  to third parties.
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
                  Your data is used to provide and improve PassAI's services. We
                  analyze your uploaded materials to generate quizzes, calculate
                  pass probability, create study plans, and personalize your
                  learning experience.
                </p>
                <p>
                  Performance data helps us refine our algorithms and improve
                  prediction accuracy. Usage analytics guide product development
                  and help us understand which features are most valuable to
                  students.
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
                  users. We do not sell your study content or quiz responses to
                  third parties. We do not use your materials to train public AI
                  models or redistribute your content.
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
                  your data, including encryption in transit and at rest, secure
                  authentication protocols, and regular security audits. Access
                  to user data is strictly limited to authorized personnel who
                  need it to provide and improve our services.
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
                  You have the right to access, modify, or delete your personal
                  data at any time. You can download your study materials and
                  quiz history from your account settings. You can request
                  account deletion, which will permanently remove all your data
                  from our systems within 30 days.
                </p>
                <p>
                  If you have questions or concerns about how your data is used,
                  contact us at passai.study@gmail.com. We are committed to
                  transparency and will respond to your inquiries promptly.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
