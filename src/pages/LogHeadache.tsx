
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LogPainLocation from "@/components/logheadache/LogPainLocation";
import LogPainIntensity from "@/components/logheadache/LogPainIntensity";
import LogPainDuration from "@/components/logheadache/LogPainDuration";
import LogSymptoms from "@/components/logheadache/LogSymptoms";
import LogTriggers from "@/components/logheadache/LogTriggers";
import LogVariables from "@/components/logheadache/LogVariables";
import LogTreatment from "@/components/logheadache/LogTreatment";

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
  const navigate = useNavigate();
  
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      // Handle form completion
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

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="flex items-center px-4 h-16">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-6 w-6 text-white/60" />
          </Button>
          <span className="ml-2 font-semibold text-white">{steps[currentStep].title}</span>
          <div className="ml-auto text-sm text-white/60">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 pb-20">
        <CurrentStepComponent />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-charcoal font-medium"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
        </Button>
      </footer>
    </div>
  );
}
