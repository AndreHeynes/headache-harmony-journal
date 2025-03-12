
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { BarChart2, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { DateRangeSelector } from "@/components/analysis/DateRangeSelector";
import { OverviewStats } from "@/components/analysis/OverviewStats";
import { PremiumInsights } from "@/components/analysis/PremiumInsights";
import { CorrelationAnalysis } from "@/components/analysis/CorrelationAnalysis";
import { NeckPainInsights } from "@/components/analysis/NeckPainInsights";
import { DetailedInsight } from "@/components/analysis/DetailedInsight";
import BottomNav from "@/components/layout/BottomNav";

export default function Analysis() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  
  // In a real app, this would come from a global state/context
  // For now, this just checks localStorage which would be set by the test mode toggle
  const isPremium = localStorage.getItem('testMode') === 'true' || false;
  
  const navigate = useNavigate();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // In a real app, you would fetch new data based on the date range
    console.log("Fetching data for range:", range);
  };

  const handleInsightCardClick = (cardType: string) => {
    if (!isPremium) {
      toast.info("Premium Feature", {
        description: "Upgrade to premium to access detailed insights"
      });
      return;
    }
    
    // Set the selected insight to show the detailed view
    setSelectedInsight(cardType);
    console.log("Showing detailed analytics for:", cardType);
  };

  const handleCloseDetailedInsight = () => {
    setSelectedInsight(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-charcoal text-white p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h1 className="text-xl font-semibold">Analysis Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
        </Button>
      </header>
      
      <DateRangeSelector onRangeChange={handleDateRangeChange} />
      
      {selectedInsight ? (
        <DetailedInsight 
          type={selectedInsight} 
          onClose={handleCloseDetailedInsight} 
        />
      ) : (
        <>
          <OverviewStats 
            episodes={12} 
            avgDuration="2.5h" 
            dailyFrequency={1.7} 
            topTriggers={4} 
          />
          
          <PremiumInsights 
            isPremium={isPremium} 
            onCardClick={handleInsightCardClick} 
          />
          
          <CorrelationAnalysis />
          
          <NeckPainInsights />
        </>
      )}
      
      <div className="fixed bottom-20 right-6">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg"
          onClick={() => navigate("/log")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
