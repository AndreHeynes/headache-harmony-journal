import { useState, useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LogPainLocation from "@/components/logheadache/LogPainLocation";
import LogPainIntensity from "@/components/logheadache/LogPainIntensity";
import LogPainDuration from "@/components/logheadache/LogPainDuration";
import LogSymptoms from "@/components/logheadache/LogSymptoms";
import LogTriggers from "@/components/logheadache/LogTriggers";
import LogVariables from "@/components/logheadache/LogVariables";
import LogTreatment from "@/components/logheadache/LogTreatment";
import { useEpisode } from "@/contexts/EpisodeContext";
import { useLocations } from "@/contexts/LocationContext";
import { ActiveEpisodeModal } from "@/components/logheadache/ActiveEpisodeModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const steps = [
  { id: 'location', title: 'Pain Location', component: LogPainLocation },
  { id: 'intensity', title: 'Pain Intensity', component: LogPainIntensity },
  { id: 'duration', title: 'Pain Duration', component: LogPainDuration },
  { id: 'symptoms', title: 'Associated Symptoms', component: LogSymptoms },
  { id: 'triggers', title: 'Triggers', component: LogTriggers },
  { id: 'variables', title: 'Self-Determined Variables', component: LogVariables },
  { id: 'treatment', title: 'Treatment Log', component: LogTreatment }
];

export default function LogHeadache() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { activeEpisode, checkForActiveEpisode, startNewEpisode, completeEpisode, continueActiveEpisode } = useEpisode();
  const { locations, loadLocations, clearLocations } = useLocations();
  
  const CurrentStepComponent = steps[currentStep].component;

  // Only check for active episode after auth is ready
  useEffect(() => {
    if (!authLoading && user) {
      checkForActiveEpisode();
    }
  }, [checkForActiveEpisode, authLoading, user]);

  useEffect(() => {
    if (activeEpisode && !currentEpisodeId) {
      setShowEpisodeModal(true);
    }
  }, [activeEpisode, currentEpisodeId]);

  // Auto-start episode if none exists when logging begins
  useEffect(() => {
    const autoStartEpisode = async () => {
      if (!currentEpisodeId && !activeEpisode && !showEpisodeModal) {
        const episodeId = await startNewEpisode();
        if (episodeId) {
          setCurrentEpisodeId(episodeId);
        }
      }
    };
    autoStartEpisode();
  }, [currentEpisodeId, activeEpisode, showEpisodeModal, startNewEpisode]);

  // Load locations when episode is set
  useEffect(() => {
    if (currentEpisodeId) {
      loadLocations(currentEpisodeId);
    }
  }, [currentEpisodeId, loadLocations]);

  const handleContinueEpisode = () => {
    if (activeEpisode) {
      setCurrentEpisodeId(activeEpisode.id);
      continueActiveEpisode();
      setShowEpisodeModal(false);
    }
  };

  const handleStartNewEpisode = async () => {
    if (activeEpisode) {
      await completeEpisode(activeEpisode.id);
    }
    clearLocations();
    const episodeId = await startNewEpisode();
    if (episodeId) {
      setCurrentEpisodeId(episodeId);
      setShowEpisodeModal(false);
    }
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleNext = async () => {
    // Mark current step as complete
    markStepComplete(steps[currentStep].id);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      if (currentEpisodeId) {
        await completeEpisode(currentEpisodeId);
      }
      clearLocations();
      toast.success('Episode logged successfully!');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    } else {
      navigate(-1);
    }
  };

  const progressPercentage = ((completedSteps.size) / steps.length) * 100;

  return (
    <>
      {activeEpisode && (
        <ActiveEpisodeModal
          episode={activeEpisode}
          onContinue={handleContinueEpisode}
          onStartNew={handleStartNewEpisode}
          open={showEpisodeModal}
        />
      )}
      
      <div className="min-h-screen bg-background pb-24">
        <header className="fixed top-0 w-full bg-card/90 backdrop-blur-sm border-b border-border z-50">
          <div className="flex items-center px-4 h-16">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-6 w-6 text-muted-foreground" />
            </Button>
            <span className="ml-2 font-semibold text-foreground">{steps[currentStep].title}</span>
            <div className="ml-auto text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </header>

        <main className="pt-20 px-4 pb-20">
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  completedSteps.has(step.id) 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStep 
                      ? 'bg-primary/20 text-foreground border border-primary' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {completedSteps.has(step.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
          
          <CurrentStepComponent episodeId={currentEpisodeId} />
        </main>

        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-card/90 backdrop-blur-sm border-t border-border">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </footer>
      </div>
    </>
  );
}
