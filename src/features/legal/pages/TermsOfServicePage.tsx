import { useNavigate } from "react-router-dom";
import Header from "@/features/landing/components/Header";
import Footer from "@/features/landing/components/Footer";
import { useEffect } from "react";

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  // Handle cross-page scrolling/navigation
  const scrollToId = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`/?scrollTo=${id}`);
    }
  };

  const handleGetStarted = () => navigate("/login");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header handleGetStarted={handleGetStarted} scrollToId={scrollToId} />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: December 9, 2025 • Effective Date: December 9, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
            
            {/* Beta Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-500 mt-0">BETA TESTING NOTICE</h2>
              <p className="font-semibold mt-4">This is a temporary Terms of Service for beta testing purposes.</p>
              <p className="mb-0">
                PassAI is currently in beta and these terms will be reviewed and updated by legal counsel before public launch. By using PassAI during beta testing, you acknowledge that you are participating in a test version of the service.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using PassAI at passai.study ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                <p><strong>Operator:</strong> Shryn Inc., a Delaware corporation</p>
                <p><strong>Contact:</strong> rebuild@shryn.ai</p>
                <p><strong>Location:</strong> Amsterdam, Netherlands</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PassAI is an AI-powered study platform that helps students prepare for IB, AP, GCSE, and other standardized exams. The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Document upload and processing</li>
                <li>AI-generated quizzes</li>
                <li>Progress tracking and analytics</li>
                <li>Personalized study plans</li>
                <li>Pass probability predictions</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">3.1 Age Requirements</h3>
                  <p className="text-muted-foreground">You must be at least <strong>14 years old</strong> to use PassAI. If you are under 18, you must have parental consent.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">3.2 Account Creation</h3>
                  <p className="text-muted-foreground mb-2">To use PassAI, you must:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Provide accurate account information</li>
                    <li>Maintain the security of your password</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Be responsible for all activity under your account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">3.3 Account Termination</h3>
                  <p className="text-muted-foreground mb-2">We reserve the right to suspend or terminate accounts that:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Violate these Terms</li>
                    <li>Engage in fraudulent activity</li>
                    <li>Misuse the Service</li>
                    <li>Remain inactive for more than 12 months</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Beta Testing Limitations</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">4.1 Beta Status</h3>
                  <p className="text-muted-foreground mb-2">PassAI is currently in <strong>beta testing</strong>. This means:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Features may change or be removed without notice</li>
                    <li>The Service may be unavailable or unstable at times</li>
                    <li>Data backup is your responsibility</li>
                    <li>You may be asked to provide feedback</li>
                    <li>Some features may not work as expected</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">4.2 No Warranties</h3>
                  <p className="text-muted-foreground mb-2">THE SERVICE IS PROVIDED "AS IS" DURING BETA TESTING. We make no warranties about:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Accuracy of quiz questions or study materials</li>
                    <li>Reliability of pass probability predictions</li>
                    <li>Availability or uptime of the Service</li>
                    <li>Compatibility with your devices or software</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">4.3 Not a Guarantee of Exam Success</h3>
                  <p className="text-muted-foreground mb-2">PassAI is a study aid tool. We do not guarantee:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>That you will pass your exams</li>
                    <li>The accuracy of AI-generated content</li>
                    <li>That our predictions will be correct</li>
                    <li>That study materials will cover all exam topics</li>
                  </ul>
                  <p className="font-semibold text-foreground mt-2">You are responsible for your own exam preparation.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. User Content and Uploads</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">5.1 Your Study Materials</h3>
                  <p className="text-muted-foreground mb-2">When you upload documents to PassAI:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>You retain all rights to your materials</li>
                    <li>You grant us a license to process them (to provide the Service)</li>
                    <li>You confirm you have the right to upload them</li>
                    <li>You acknowledge they will be processed by AI</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">5.2 Prohibited Content</h3>
                  <p className="text-muted-foreground mb-2">You may NOT upload:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Copyrighted materials you don't own or have rights to use</li>
                    <li>Illegal or harmful content</li>
                    <li>Malware or viruses</li>
                    <li>Personal information of others without consent</li>
                    <li>Exam questions or answer keys obtained improperly</li>
                  </ul>
                </div>
                <div>
                   <h3 className="text-xl font-semibold mb-2">5.3 Content Removal</h3>
                   <p className="text-muted-foreground mb-2">We reserve the right to remove content that:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Violates these Terms</li>
                      <li>Violates copyright or intellectual property laws</li>
                      <li>Is inappropriate or harmful</li>
                      <li>Violates applicable laws</li>
                    </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. AI-Generated Content</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">6.1 Accuracy Disclaimer</h3>
                  <p className="text-muted-foreground mb-2">AI-generated quizzes and study materials:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>May contain errors or inaccuracies</li>
                    <li>Should not be your sole source of study material</li>
                    <li>Are created based on your uploaded documents</li>
                    <li>May not cover all exam topics</li>
                  </ul>
                  <p className="font-semibold text-foreground mt-2">Always verify information with official study materials.</p>
                </div>
                <div>
                   <h3 className="text-xl font-semibold mb-2">6.2 Your Responsibility</h3>
                   <p className="text-muted-foreground mb-2">You are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Verifying the accuracy of AI-generated content</li>
                      <li>Using multiple study resources</li>
                      <li>Consulting official exam materials</li>
                      <li>Reviewing answers and explanations critically</li>
                    </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">6.3 Feedback</h3>
                  <p className="text-muted-foreground">If you find errors in AI-generated content, please report them to <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a>.</p>
                </div>
              </div>
            </section>

             {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Acceptable Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">7.1 Permitted Use</h3>
                  <p className="text-muted-foreground mb-2">You may use PassAI for:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Personal study and exam preparation</li>
                    <li>Educational purposes</li>
                    <li>Legitimate academic work</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">7.2 Prohibited Use</h3>
                  <p className="text-muted-foreground mb-2">You may NOT:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Share your account with others</li>
                    <li>Attempt to hack, reverse engineer, or exploit the Service</li>
                    <li>Use automated tools (bots, scrapers) to access the Service</li>
                    <li>Upload malicious content or spam</li>
                    <li>Violate any applicable laws</li>
                    <li>Misrepresent your identity or affiliation</li>
                    <li>Use the Service to cheat on exams</li>
                    <li>Redistribute or resell our content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">7.3 Consequences</h3>
                  <p className="text-muted-foreground mb-2">Violation of these terms may result in:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Account suspension or termination</li>
                    <li>Legal action if necessary</li>
                    <li>Reporting to educational institutions if applicable</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Payment Terms</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.1 Beta Testing Pricing</h3>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>The Service may be free or offered at a discounted rate</li>
                     <li>Pricing is subject to change</li>
                     <li>We reserve the right to introduce paid subscriptions</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.2 Future Pricing</h3>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Paid subscription plans will be introduced</li>
                     <li>Beta testers may receive special pricing</li>
                     <li>Pricing will be communicated clearly before charging</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.3 Refund Policy</h3>
                   <p className="text-muted-foreground">Payment terms and refund policies will be established before public launch.</p>
                 </div>
              </div>
            </section>

             {/* Section 9 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.1 PassAI Ownership</h3>
                   <p className="text-muted-foreground mb-2">PassAI owns all rights to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>The PassAI platform and software</li>
                     <li>The PassAI brand, logo, and trademarks</li>
                     <li>The user interface and design</li>
                     <li>Original content created by PassAI</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.2 Your Ownership</h3>
                   <p className="text-muted-foreground mb-2">You retain all rights to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Study materials you upload</li>
                     <li>Notes you create</li>
                     <li>Your personal data</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.3 License to Use</h3>
                   <p className="text-muted-foreground mb-2">By using PassAI, you grant us a license to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Process your study materials with AI</li>
                     <li>Store your data as described in the Privacy Policy</li>
                     <li>Use anonymized data to improve the Service</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 10 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">10. Privacy and Data Protection</h2>
              <p className="text-muted-foreground mb-4">Your use of PassAI is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">10.2 Data Collection</h3>
                   <p className="text-muted-foreground mb-2">We collect and process data as described in the Privacy Policy, including:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Account information</li>
                     <li>Study materials</li>
                     <li>Quiz responses</li>
                     <li>Usage analytics</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">10.3 Your Rights</h3>
                   <p className="text-muted-foreground mb-2">You have the right to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Access your data</li>
                     <li>Delete your account</li>
                     <li>Export your data</li>
                     <li>Opt out of analytics</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 11 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">11.1 No Liability for Exam Results</h3>
                   <p className="text-muted-foreground mb-2 uppercase text-sm font-bold tracking-wide">We are not liable for:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Exam failures or poor performance</li>
                     <li>Inaccurate AI-generated content</li>
                     <li>Missed study topics or incomplete preparation</li>
                     <li>Technical issues that prevent access to the Service</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">11.2 Maximum Liability</h3>
                   <p className="text-muted-foreground text-sm uppercase font-bold tracking-wide">
                     To the maximum extent permitted by law, our total liability to you shall not exceed the amount you paid to use PassAI in the past 12 months, or $100, whichever is greater.
                   </p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">11.3 Disclaimer of Consequential Damages</h3>
                   <p className="text-muted-foreground mb-2 uppercase text-sm font-bold tracking-wide">We are not liable for:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Loss of data or study materials</li>
                     <li>Opportunity costs or lost time</li>
                     <li>Emotional distress or anxiety</li>
                     <li>Consequential or indirect damages</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 12 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Shryn Inc., its officers, employees, and affiliates from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-1 text-muted-foreground">
                <li>Your violation of these Terms</li>
                <li>Your use of the Service</li>
                <li>Content you upload</li>
                <li>Your violation of any laws or third-party rights</li>
              </ul>
            </section>

             {/* Section 13 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">13. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground mb-4 uppercase text-sm font-bold tracking-wide">
                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or reliability</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
            </section>

             {/* Section 14 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">14. Service Modifications</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">14.1 Changes to Service</h3>
                   <p className="text-muted-foreground mb-2">We reserve the right to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Modify or discontinue features</li>
                     <li>Change pricing or subscription plans</li>
                     <li>Update the user interface</li>
                     <li>Add or remove functionality</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">14.2 Notice of Changes</h3>
                   <p className="text-muted-foreground mb-2">We will notify you of significant changes through:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Email notification</li>
                     <li>In-app announcements</li>
                     <li>Website notices</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">14.3 Your Options</h3>
                   <p className="text-muted-foreground mb-2">If you do not agree to changes:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>You may discontinue using the Service</li>
                     <li>You may delete your account</li>
                     <li>You will not receive a refund for unused subscription time</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 15 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">15. Termination</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">15.1 Your Right to Terminate</h3>
                   <p className="text-muted-foreground mb-2">You may terminate your account at any time by:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Deleting your account in settings</li>
                     <li>Contacting <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a></li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">15.2 Our Right to Terminate</h3>
                   <p className="text-muted-foreground mb-2">We may terminate your account if:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>You violate these Terms</li>
                     <li>Your account is inactive for 12+ months</li>
                     <li>The Service is discontinued</li>
                     <li>Required by law</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">15.3 Effect of Termination</h3>
                   <p className="text-muted-foreground mb-2">Upon termination:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Your access to the Service ends immediately</li>
                     <li>Your data will be deleted per the Privacy Policy</li>
                     <li>You remain liable for any outstanding obligations</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 16 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">16. Dispute Resolution</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">16.1 Governing Law</h3>
                   <p className="text-muted-foreground">These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">16.2 Informal Resolution</h3>
                   <p className="text-muted-foreground">Before filing any legal action, you agree to contact us at <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a> to attempt to resolve the dispute informally.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">16.3 Arbitration</h3>
                   <p className="text-muted-foreground">Any disputes that cannot be resolved informally will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">16.4 Class Action Waiver</h3>
                   <p className="text-muted-foreground">You agree to resolve disputes individually and waive any right to participate in class action lawsuits.</p>
                 </div>
              </div>
            </section>

             {/* Section 17 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">17. General Provisions</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">17.1 Entire Agreement</h3>
                   <p className="text-muted-foreground">These Terms, along with the Privacy Policy, constitute the entire agreement between you and Shryn Inc.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">17.2 Severability</h3>
                   <p className="text-muted-foreground">If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">17.3 No Waiver</h3>
                   <p className="text-muted-foreground">Our failure to enforce any provision does not waive our right to enforce it later.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">17.4 Assignment</h3>
                   <p className="text-muted-foreground">You may not assign these Terms to anyone else. We may assign our rights to a successor or affiliate.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">17.5 Force Majeure</h3>
                   <p className="text-muted-foreground">We are not liable for delays or failures due to circumstances beyond our control (natural disasters, war, pandemics, etc.).</p>
                 </div>
              </div>
            </section>

             {/* Section 18 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">18. Contact Information</h2>
              <p className="text-muted-foreground mb-4">For questions about these Terms, contact us:</p>
              <div className="bg-muted/50 p-6 rounded-xl">
                <p className="mb-1"><strong>Email:</strong> <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a></p>
                <p className="mb-1"><strong>Company:</strong> Shryn Inc.</p>
                <p className="mb-1"><strong>Address:</strong> Amsterdam, Netherlands</p>
                <p className="mb-0"><strong>Response Time:</strong> We will respond within 7 business days.</p>
              </div>
            </section>

             {/* Section 19 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">19. Changes to These Terms</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">19.1 Updates</h3>
                   <p className="text-muted-foreground mb-2">We may update these Terms from time to time. We will notify you of material changes by:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Email notification</li>
                     <li>Prominent notice on the website</li>
                     <li>In-app notification</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">19.2 Your Acceptance</h3>
                   <p className="text-muted-foreground">Your continued use of PassAI after changes constitutes acceptance of the updated Terms.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">19.3 Version History</h3>
                   <p className="text-muted-foreground">Version 1.0 (Beta): December 9, 2025</p>
                 </div>
              </div>
            </section>

             {/* Section 20 */}
             <section className="border-t pt-8 mt-12">
              <h2 className="text-2xl font-bold mb-4">20. Beta Tester Acknowledgment</h2>
              <div className="bg-linear-to-r from-primary/10 to-purple-600/10 p-6 rounded-xl border border-primary/20">
                <p className="font-semibold mb-4">By using PassAI during beta testing, you acknowledge and agree that:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                  <li>PassAI is in beta and may contain bugs or errors</li>
                  <li>Features may change or be discontinued</li>
                  <li>The Service may be unavailable at times</li>
                  <li>You will provide feedback if requested</li>
                  <li>You understand this is not a final product</li>
                  <li>These Terms will be reviewed by legal counsel before public launch</li>
                  <li>You are participating voluntarily in testing</li>
                </ul>
                <p className="text-center text-xl font-bold text-primary">Thank you for helping us improve PassAI!</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer scrollToId={scrollToId} />
    </div>
  );
}
