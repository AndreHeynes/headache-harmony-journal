
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoCard } from "@/components/profile/PersonalInfoCard";
import { AppSettingsCard } from "@/components/profile/AppSettingsCard";
import { NotificationsCard } from "@/components/profile/NotificationsCard";

export default function Profile() {
  const navigate = useNavigate();
  const [userCountry, setUserCountry] = useState(() => 
    localStorage.getItem('userCountry') || 'US'
  );

  const handleCountryChange = (value: string) => {
    setUserCountry(value);
    localStorage.setItem('userCountry', value);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewPolicies = () => {
    navigate("/policy");
  };

  return (
    <div className="min-h-screen bg-charcoal text-gray-100 pb-20">
      <ProfileHeader onBack={handleGoBack} />

      <main className="pt-20 px-4 space-y-6">
        <PersonalInfoCard />
        <AppSettingsCard 
          userCountry={userCountry} 
          onCountryChange={handleCountryChange} 
          onViewPolicies={handleViewPolicies} 
        />
        <NotificationsCard />
      </main>

      <BottomNav />
    </div>
  );
}
