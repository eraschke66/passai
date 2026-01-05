import { useNavigate } from "react-router-dom";
import Header from "@/features/landing/components/Header";
import Footer from "@/features/landing/components/Footer";
import { useEffect } from "react";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
              <p className="font-semibold mt-4">This is a temporary Privacy Policy for beta testing purposes.</p>
              <p className="mb-0">
                PassAI is currently in beta and this policy will be reviewed and updated by legal counsel before public launch. By using PassAI during beta testing, you acknowledge that you are participating in a test version of the service.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                PassAI ("we," "our," or "us") is operated by Shryn Inc., a Delaware corporation. This Privacy Policy explains how we collect, use, and protect your information when you use the PassAI platform at passai.study.
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                <p><strong>Company:</strong> Shryn Inc.</p>
                <p><strong>Email:</strong> rebuild@shryn.ai</p>
                <p><strong>Location:</strong> Amsterdam, Netherlands</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">2.1 Account Information</h3>
                  <p className="text-muted-foreground mb-2">When you create an account, we collect:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Date of birth (to verify age)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2.2 Educational Content</h3>
                  <p className="text-muted-foreground mb-2">When you use PassAI, we collect:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Study materials you upload (PDFs, documents, presentations)</li>
                    <li>Quiz responses and performance data</li>
                    <li>Study plan preferences</li>
                    <li>Progress tracking information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2.3 Usage Information</h3>
                  <p className="text-muted-foreground mb-2">We automatically collect:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Device information (browser type, operating system)</li>
                    <li>Log data (IP address, access times, pages viewed)</li>
                    <li>Cookies for session management and analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2.4 Error Tracking</h3>
                  <p className="text-muted-foreground">We use Sentry to collect error reports and diagnostic information to improve the service.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2.5 Analytics</h3>
                  <p className="text-muted-foreground">We use PostHog to collect anonymized usage analytics to understand how users interact with PassAI.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and improve the PassAI service</li>
                <li>Generate personalized quizzes and study plans</li>
                <li>Track your learning progress</li>
                <li>Communicate with you about your account</li>
                <li>Analyze usage patterns to improve the platform</li>
                <li>Debug technical issues</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. AI Processing</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">4.1 Document Processing</h3>
                  <p className="text-muted-foreground mb-2">Your uploaded study materials are processed using Claude AI (by Anthropic) to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Extract key concepts and topics</li>
                    <li>Generate quiz questions</li>
                    <li>Create personalized study recommendations</li>
                  </ul>
                </div>
                 <div>
                  <h3 className="text-xl font-semibold mb-2">4.2 Data Sent to AI Services</h3>
                  <p className="text-muted-foreground mb-2">When you upload documents or take quizzes:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Your study materials are sent to Anthropic's Claude API</li>
                    <li>Your quiz responses are analyzed using AI</li>
                    <li><strong>No personally identifiable information</strong> (name, email, age) is sent to AI services</li>
                    <li>Only your study content and academic performance data is processed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">4.3 AI Data Retention</h3>
                  <p className="text-muted-foreground">Anthropic processes data according to their privacy policy. Study materials are cached temporarily for performance optimization but are not used to train AI models.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Storage and Security</h2>
              <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">5.1 Where We Store Data</h3>
                   <p className="text-muted-foreground mb-2">Your data is stored on:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Supabase (cloud database provider)</li>
                     <li>Servers located in the United States</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">5.2 Security Measures</h3>
                   <p className="text-muted-foreground mb-2">We implement:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Encrypted passwords (industry-standard hashing)</li>
                     <li>Secure HTTPS connections</li>
                     <li>Regular security updates</li>
                     <li>Access controls and authentication</li>
                   </ul>
                 </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-2">5.3 Data Retention</h3>
                    <p className="text-muted-foreground mb-2">We retain your data:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li><strong>Account information:</strong> Until you delete your account</li>
                      <li><strong>Study materials:</strong> Until you delete them or your account</li>
                      <li><strong>Quiz history:</strong> Until you delete your account</li>
                      <li><strong>Usage logs:</strong> 90 days</li>
                    </ul>
                 </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Sharing</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">6.1 Third-Party Services</h3>
                   <p className="text-muted-foreground mb-2">We share data with:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li><strong>Anthropic (Claude AI):</strong> Study materials and quiz content for processing</li>
                     <li><strong>Sentry:</strong> Error logs and diagnostic information</li>
                     <li><strong>PostHog:</strong> Anonymized usage analytics</li>
                     <li><strong>Supabase:</strong> Database hosting</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">6.2 We Do NOT:</h3>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Sell your personal information</li>
                     <li>Share your data with advertisers</li>
                     <li>Use your study materials for any purpose other than providing you service</li>
                     <li>Share your information with schools or parents without your consent</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">6.3 Legal Requirements</h3>
                   <p className="text-muted-foreground mb-2">We may disclose information if required by law or to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Comply with legal obligations</li>
                     <li>Protect our rights or property</li>
                     <li>Prevent fraud or security issues</li>
                     <li>Protect the safety of users</li>
                   </ul>
                 </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">7.1 Access and Control</h3>
                   <p className="text-muted-foreground mb-2">You have the right to:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Access your personal information</li>
                     <li>Update or correct your information</li>
                     <li>Delete your account and data</li>
                     <li>Export your data</li>
                     <li>Opt out of marketing communications</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">7.2 How to Exercise Your Rights</h3>
                   <p className="text-muted-foreground">To exercise these rights, contact us at <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a> or use the account settings in the app.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">7.3 Data Deletion</h3>
                   <p className="text-muted-foreground mb-2">When you delete your account:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Your personal information is permanently deleted within 30 days</li>
                     <li>Your study materials are permanently deleted within 30 days</li>
                     <li>Anonymized usage data may be retained for analytics</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 8 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.1 Age Requirement</h3>
                   <p className="text-muted-foreground">PassAI is intended for users aged <strong>14 and older</strong>. We do not knowingly collect information from children under 14.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.2 Parental Consent</h3>
                   <p className="text-muted-foreground">If you are under 18, please obtain parental consent before using PassAI. Parents may contact us at <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a> to review or delete their child's information.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">8.3 COPPA Compliance</h3>
                   <p className="text-muted-foreground">We comply with the Children's Online Privacy Protection Act (COPPA). If we discover we have collected information from a child under 14 without parental consent, we will delete it immediately.</p>
                 </div>
              </div>
            </section>

             {/* Section 9 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">9. International Users</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.1 European Users (GDPR)</h3>
                   <p className="text-muted-foreground mb-2">If you are in the European Economic Area (EEA), you have additional rights under GDPR:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Right to be forgotten</li>
                     <li>Right to data portability</li>
                     <li>Right to restrict processing</li>
                     <li>Right to object to processing</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.2 Data Transfers</h3>
                   <p className="text-muted-foreground">Your data may be transferred to and stored in the United States. By using PassAI, you consent to this transfer.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">9.3 Legal Basis for Processing</h3>
                   <p className="text-muted-foreground mb-2">We process your data based on:</p>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li>Your consent (when you create an account)</li>
                     <li>Contract performance (to provide the service)</li>
                     <li>Legitimate interests (to improve the service)</li>
                   </ul>
                 </div>
              </div>
            </section>

             {/* Section 10 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">10. Cookies and Tracking</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">10.1 Cookies We Use</h3>
                   <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                     <li><strong>Essential cookies:</strong> For login and session management (required)</li>
                     <li><strong>Analytics cookies:</strong> For PostHog usage tracking (optional)</li>
                     <li><strong>Error tracking:</strong> For Sentry diagnostic information (optional)</li>
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">10.2 Managing Cookies</h3>
                   <p className="text-muted-foreground">You can disable non-essential cookies in your browser settings. Note that disabling essential cookies will prevent you from using PassAI.</p>
                 </div>
              </div>
            </section>

             {/* Section 11 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-2">We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
                <li>Email notification</li>
                <li>Notice on the PassAI website</li>
                <li>In-app notification</li>
              </ul>
              <p className="text-muted-foreground">Your continued use of PassAI after changes constitutes acceptance of the updated policy.</p>
            </section>

             {/* Section 12 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-4">If you have questions about this Privacy Policy or your data, contact us:</p>
              <div className="bg-muted/50 p-6 rounded-xl">
                 <p className="mb-1"><strong>Email:</strong> <a href="mailto:rebuild@shryn.ai" className="text-primary hover:underline">rebuild@shryn.ai</a></p>
                 <p className="mb-1"><strong>Company:</strong> Shryn Inc.</p>
                 <p className="mb-1"><strong>Address:</strong> Amsterdam, Netherlands</p>
                 <p className="mb-0"><strong>Response Time:</strong> We will respond to privacy requests within 30 days.</p>
              </div>
            </section>

             {/* Section 13 */}
             <section className="border-t pt-8 mt-12">
              <h2 className="text-2xl font-bold mb-4">13. Beta Testing Acknowledgment</h2>
              <div className="bg-linear-to-r from-primary/10 to-purple-600/10 p-6 rounded-xl border border-primary/20">
                <p className="font-semibold mb-4">By using PassAI during beta testing, you acknowledge:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                  <li>This is a test version of the service</li>
                  <li>Features may change or be removed</li>
                  <li>Data backup is your responsibility</li>
                  <li>This Privacy Policy will be reviewed by legal counsel before public launch</li>
                  <li>We may contact you for feedback during beta testing</li>
                </ul>
              </div>
            </section>

            {/* Section 14 */}
             <section>
              <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="text-xl font-semibold mb-2">14.1 Governing Law</h3>
                   <p className="text-muted-foreground">This Privacy Policy is governed by the laws of the State of Delaware, USA.</p>
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold mb-2">14.2 Arbitration</h3>
                   <p className="text-muted-foreground">Any disputes will be resolved through binding arbitration in accordance with the Terms of Service.</p>
                 </div>
              </div>
            </section>

             {/* Appendix */}
             <section className="border-t pt-8 mt-12">
               <h2 className="text-xl font-bold mb-4">Appendix: Third-Party Privacy Policies</h2>
               <p className="text-muted-foreground mb-4">For more information about how our service providers handle data:</p>
               <ul className="space-y-2 text-muted-foreground">
                 <li><strong>Anthropic (Claude AI):</strong> <a href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://www.anthropic.com/privacy</a></li>
                 <li><strong>Sentry:</strong> <a href="https://sentry.io/privacy/" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://sentry.io/privacy/</a></li>
                 <li><strong>PostHog:</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://posthog.com/privacy</a></li>
                 <li><strong>Supabase:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://supabase.com/privacy</a></li>
               </ul>
             </section>

          </div>
        </div>
      </main>

      <Footer scrollToId={scrollToId} />
    </div>
  );
}
