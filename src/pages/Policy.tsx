
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
                    ? "bg-primary text-charcoal" 
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
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
                  This Privacy Policy describes how your personal information is collected, used, and shared when you use our application.
                </p>
                <h3 className="text-md font-semibold text-white mt-4">Information We Collect</h3>
                <p className="text-gray-300">
                  We collect information you provide directly to us, such as your name, email address, and any other information you choose to provide.
                </p>
                <p className="text-gray-300">
                  We also automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                </p>
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
                  We implement a variety of security measures to maintain the safety of your personal information.
                </p>
                <h3 className="text-md font-semibold text-white mt-4">Your Data Rights</h3>
                <p className="text-gray-300">
                  If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.
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
