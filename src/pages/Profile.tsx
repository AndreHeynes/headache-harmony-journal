
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoCard } from "@/components/profile/PersonalInfoCard";
import { NotificationsCard } from "@/components/profile/NotificationsCard";
import { AppSettingsCard } from "@/components/profile/AppSettingsCard";
import { TestModeToggle } from "@/components/profile/TestModeToggle";
import { DataManagementCard } from "@/components/profile/DataManagementCard";
import BottomNav from "@/components/layout/BottomNav";

export default function Profile() {
  const navigate = useNavigate();
  const [isTestMode, setIsTestMode] = useState(false);
  
  // This state would be lifted to a global context in a real app
  // so that premium status can be accessed throughout the app
  const [isPremiumOverride, setIsPremiumOverride] = useState(false);
  
  const handleToggleTestMode = (enabled: boolean) => {
    setIsTestMode(enabled);
    setIsPremiumOverride(enabled);
    
    // In a real app, you would update a global state or context
    // to make premium features available throughout the app
    console.log("Test mode toggled:", enabled);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-charcoal text-white p-4 pb-20">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleGoBack}
        className="text-gray-400 hover:text-white hover:bg-gray-800 mb-4"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <ProfileHeader />
      
      <div className="space-y-4 mt-6">
        {process.env.NODE_ENV === 'development' && (
          <TestModeToggle 
            isTestMode={isTestMode} 
            onToggleTestMode={handleToggleTestMode} 
          />
        )}
        
        <PersonalInfoCard />
        <NotificationsCard />
        <DataManagementCard />
        <AppSettingsCard isPremium={isPremiumOverride} />
      </div>
      
      <BottomNav />
    </div>
  );
}
