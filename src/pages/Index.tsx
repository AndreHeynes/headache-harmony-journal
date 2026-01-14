import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartLine, Search, Users, ArrowRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { APP_CONFIG } from "@/config/appConfig";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
        {/* Logo and Welcome Section */}
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto flex items-center justify-center">
            <img 
              src="/lovable-uploads/78336bbf-2702-4d43-abaa-d5f6e646d8b4.png" 
              alt="Headache Journal Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome
            </h1>
            <h2 className="text-xl text-gray-700">
              My Headache Experience Journal!™
            </h2>
          </div>
          <p className="text-gray-500">
            {APP_CONFIG.BETA_MODE 
              ? "Access is currently limited to beta testers."
              : "Let's start the journey of developing a better understanding of your headache experience."
            }
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: "Participate" },
            { icon: Search, label: "Understand" },
            { icon: ChartLine, label: "Recognize" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-gray-600 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <Card className="bg-white border-gray-200 shadow-sm p-6 space-y-4">
          {APP_CONFIG.BETA_MODE ? (
            // Beta Mode UI
            user ? (
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <p className="text-sm text-center text-gray-500 mb-2">
                  If you have a beta access link, please use it to access the app.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                  onClick={() => window.open(APP_CONFIG.BETA_SIGNUP_URL, '_blank')}
                >
                  Request Beta Access
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </>
            )
          ) : (
            // Normal Mode UI
            <>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                onClick={() => navigate("/auth")}
              >
                Let's Start
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                onClick={() => navigate("/auth")}
              >
                My Account
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}