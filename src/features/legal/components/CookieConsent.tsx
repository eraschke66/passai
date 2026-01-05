import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("passai-cookie-consent");
    if (!consent) {
      // Small delay to show animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("passai-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("passai-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">We value your privacy</h3>
          <p className="text-sm text-muted-foreground max-w-3xl">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies in accordance with our GDPR compliant policy.
            Read our <Link to="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link> and <Link to="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" onClick={handleDecline} className="flex-1 md:flex-none">
              Decline
            </Button>
            <Button onClick={handleAccept} className="flex-1 md:flex-none bg-linear-to-r from-primary to-purple-600 hover:opacity-90">
              Accept All
            </Button>
        </div>
      </div>
    </div>
  );
}
