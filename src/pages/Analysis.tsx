
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
import { TrendComparison } from "@/components/analysis/TrendComparison";
import { MedicationAnalysis } from "@/components/analysis/MedicationAnalysis";
import { LifestyleAnalysis } from "@/components/analysis/LifestyleAnalysis";
import { NeckPainInsights } from "@/components/analysis/NeckPainInsights";
import { DetailedInsight } from "@/components/analysis/DetailedInsight";
import BottomNav from "@/components/layout/BottomNav";
import { useTestContext } from "@/contexts/TestContext";

export default function Analysis() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  
  const { premiumFeatures, logTestEvent } = useTestContext();
  
  const navigate = useNavigate();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // In a real app, you would fetch new data based on the date range
    logTestEvent({
      type: "action",
      details: "Date range changed",
      component: "DateRangeSelector",
      metadata: { range }
    });
    console.log("Fetching data for range:", range);
  };

  const handleInsightCardClick = (cardType: string) => {
    logTestEvent({
      type: "feature_usage",
      details: `Insight card clicked: ${cardType}`,
      component: "PremiumInsights"
    });
    
    // Check for special premium features that might have separate toggles
    const isNeckPainInsight = cardType === 'neck-pain';
    
    if (isNeckPainInsight && !premiumFeatures.neck_correlation) {
      toast.info("Premium Neck Pain Feature", {
        description: "Upgrade to premium to access neck pain correlation insights"
      });
      return;
    }
    
    if (!premiumFeatures.insights && !isNeckPainInsight) {
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
    logTestEvent({
      type: "action",
      details: "Detailed insight closed",
      component: "DetailedInsight"
    });
  };

  const handleGoBack = () => {
    logTestEvent({
      type: "navigation",
      details: "Navigated back from Analysis"
    });
    navigate(-1);
  };

  // Determine if neck pain insights should be shown
  const showNeckPainInsights = premiumFeatures.neck_correlation;

  return (
    <div className="bg-background text-foreground p-4 pb-20 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Analysis Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
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
          <OverviewStats daysRange={30} />
          
          <PremiumInsights onCardClick={handleInsightCardClick} />
          
          <CorrelationAnalysis />
          
          <TrendComparison monthsToAnalyze={6} />
          
          <MedicationAnalysis />
          
          <LifestyleAnalysis />
          
          {/* Only show neck pain insights if the premium feature is enabled */}
          {showNeckPainInsights && <NeckPainInsights />}
        </>
      )}
      
      <div className="fixed bottom-20 right-6">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          onClick={() => {
            logTestEvent({
              type: "navigation",
              details: "Navigate to log headache"
            });
            navigate("/log");
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
