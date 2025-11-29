import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section
      className="py-20 bg-linear-to-b from-primary/5 to-background"
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
                PassAI is built around your materials and gives you a real-time
                pass probability based on your actual progress. RevisionDojo
                focuses on pre-made question banks, which may not match your
                specific curriculum. PassAI adapts quizzes to your weak spots
                and generates personalized study plans, while RevisionDojo
                relies on community-created content that isn't always aligned
                with your exam format or syllabus.
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
                your test, and how well you've covered the material. As you take
                quizzes and study more, the algorithm refines its estimate. It's
                not a magic crystal ball—it's a data-driven prediction that
                improves with your engagement. Think of it as a dynamic forecast
                that helps you know where you stand and what you need to do to
                pass.
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
                slides, textbook excerpts, handwritten notes (via image upload),
                or type in content directly. The AI analyzes your materials to
                generate quizzes and summaries tailored to what you're actually
                studying. Unlike Quizlet, which is community-driven, PassAI
                ensures your quizzes match your specific course content.
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
                Your uploaded materials are stored in private, encrypted storage
                buckets accessible only to you. PassAI doesn't share your
                content with other users, sell it to third parties, or use it to
                train public AI models. Processing is temporary and isolated.
                Your progress data and quiz results are confidential and will
                never be shared with schools or parents without your explicit
                permission.
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
                account settings. If you cancel, you'll retain access to premium
                features until the end of your current billing period. After
                that, your account will revert to the free tier, which still
                lets you use basic features like one subject and limited
                quizzes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
