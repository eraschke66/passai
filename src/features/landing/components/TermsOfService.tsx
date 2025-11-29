import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TermsOfService() {
  return (
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
                  you do not agree with any part of these terms, you may not use
                  our service.
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
                  upload study materials, take quizzes, track your progress, and
                  use AI-generated study plans to prepare for exams. You are
                  encouraged to use PassAI as a supplement to your regular
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
                  you do not own or have permission to use. You may not attempt
                  to reverse-engineer, hack, or exploit PassAI's systems or
                  algorithms. Sharing account credentials, creating multiple
                  accounts to bypass usage limits, or using automated bots to
                  interact with PassAI is prohibited.
                </p>
                <p>
                  You may not upload illegal, harmful, or offensive content,
                  including materials that promote violence, hate speech, or
                  academic dishonesty. PassAI is not to be used for cheating on
                  exams or assessments. Misuse of the service may result in
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
                  You retain ownership of all materials you upload to PassAI. By
                  uploading content, you grant PassAI a limited license to
                  process, analyze, and generate educational tools (such as
                  quizzes and summaries) for your personal use. This license is
                  non-exclusive and terminates when you delete your content or
                  account.
                </p>
                <p>
                  Your uploaded materials are stored privately and are not
                  shared with other users or third parties. PassAI processes
                  your content temporarily to generate AI features and does not
                  redistribute or repurpose your materials.
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
                  behavior, or use our service in ways that harm other users or
                  our systems.
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
  );
}
