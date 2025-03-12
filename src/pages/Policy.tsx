import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/layout/BottomNav";

export default function Policy() {
  const navigate = useNavigate();
  const [activePolicy, setActivePolicy] = useState<string>("privacy");

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-charcoal pb-20">
      <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Policies</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden mb-6">
          <div className="flex w-full border-b border-gray-700">
            {["privacy", "terms", "cookies", "data"].map((policy) => (
              <button
                key={policy}
                onClick={() => setActivePolicy(policy)}
                className={`flex-1 px-3 py-4 text-sm font-medium transition-colors focus:outline-none
                  ${activePolicy === policy 
                    ? "bg-primary text-charcoal font-semibold shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
              >
                {policy.charAt(0).toUpperCase() + policy.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activePolicy === "privacy" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Privacy Policy</h2>
                <p className="text-gray-300">
                  [Placeholder] This Privacy Policy outlines how we collect, use, and protect your personal information when you use our application.
                </p>
                <h3 className="text-md font-semibold text-white mt-4">Information Collection</h3>
                <p className="text-gray-300">
                  [Placeholder] We collect information you provide directly to us, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Account information (name, email, etc.)</li>
                  <li>Health-related data you choose to provide</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            )}
            
            {activePolicy === "terms" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Terms of Service</h2>
                <p className="text-gray-300">
                  These Terms of Service ("Terms") govern your access to and use of our services, including our website and mobile application.
                </p>
                <h3 className="text-md font-semibold text-white mt-4">User Accounts</h3>
                <p className="text-gray-300">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
              </div>
            )}
            
            {activePolicy === "cookies" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Cookie Policy</h2>
                <p className="text-gray-300">
                  Cookies are small pieces of text sent to your web browser by a website you visit. They help us collect standard internet log information and visitor behavior information.
                </p>
                <h3 className="text-md font-semibold text-white mt-4">How We Use Cookies</h3>
                <p className="text-gray-300">
                  We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction.
                </p>
              </div>
            )}
            
            {activePolicy === "data" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Data Protection</h2>
                <p className="text-gray-300">
                  [Placeholder] Our commitment to protecting your data includes:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Industry-standard encryption</li>
                  <li>Regular security audits</li>
                  <li>Strict access controls</li>
                  <li>Data retention policies</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  [Placeholder] For detailed information about our data protection practices, please contact our privacy team.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
