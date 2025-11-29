import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function CopyrightSection() {
  return (
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
                  Store user-uploaded files permanently or share them with other
                  users
                </li>
                <li>
                  Reproduce or redistribute copyrighted educational content
                </li>
                <li>
                  Claim ownership of any materials users upload to the platform
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
                accessed, viewed, or downloaded by other users or third parties.
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
                temporarily in server memory to generate quizzes and summaries.
                The extracted content is processed in real-time and not
                permanently cached or stored in a form accessible to others.
                Processing is ephemeral and limited to the scope necessary to
                provide immediate educational value to the uploading user.
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
                you believe content uploaded by a user infringes your copyright,
                submit a DMCA notice to passai.study@gmail.com with details of
                the allegedly infringing content. We will investigate promptly
                and, if valid, remove the content and notify the user. Repeat
                copyright infringers will have their accounts terminated.
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
                allow browsing of other users' materials. The service generates
                derivative educational tools (quizzes, summaries, progress
                tracking) rather than republishing copyrighted works. Users
                cannot search for, discover, or access content uploaded by
                others.
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
                PassAI maintains logs of user activity for security, debugging,
                and compliance purposes. These logs help us identify and address
                copyright violations, prevent abuse, and respond to legal
                requests. We cooperate with law enforcement and copyright
                holders when legally required, but we do not proactively monitor
                user content or share logs without a valid legal basis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
