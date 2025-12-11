
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
import ExportSettingsCard from "@/components/profile/ExportSettingsCard";
import { HealthTrackerConnectionsCard } from "@/components/profile/HealthTrackerConnectionsCard";
import BottomNavWithTest from "@/components/layout/BottomNavWithTest";
import { toast } from "sonner";
import { useTestContext } from "@/contexts/TestContext";

export default function Profile() {
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState("US");
  const { isTestMode, setIsTestMode, isPremiumOverride, setIsPremiumOverride, logTestEvent } = useTestContext();
  
  const handleToggleTestMode = (enabled: boolean) => {
    setIsTestMode(enabled);
    
    // When test mode is enabled, we also enable premium override
    // Individual features can still be controlled in the test dashboard
    if (enabled) {
      setIsPremiumOverride(enabled);
    }
    
    logTestEvent({
      type: "action",
      details: `Test mode ${enabled ? "enabled" : "disabled"}`,
      component: "TestModeToggle"
    });
    
    console.log("Test mode toggled:", enabled);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCountryChange = (country: string) => {
    setUserCountry(country);
    console.log("Country changed to:", country);
  };

  const handleViewPolicies = () => {
    navigate("/policy");
    console.log("Viewing policies");
  };

  const isTestingEnabled = process.env.NODE_ENV === 'development' || 
                          localStorage.getItem('enableTesting') === 'true';

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
      
      <ProfileHeader onBack={handleGoBack} />
      
      <div className="space-y-4 mt-6">
        {isTestingEnabled && (
          <TestModeToggle 
            isTestMode={isTestMode} 
            onToggleTestMode={handleToggleTestMode} 
          />
        )}
        
        <PersonalInfoCard />
        <HealthTrackerConnectionsCard />
        <ExportSettingsCard />
        <NotificationsCard />
        <DataManagementCard />
        <AppSettingsCard 
          userCountry={userCountry}
          onCountryChange={handleCountryChange}
          onViewPolicies={handleViewPolicies}
        />
      </div>
      
      <BottomNavWithTest />
    </div>
  );
}
