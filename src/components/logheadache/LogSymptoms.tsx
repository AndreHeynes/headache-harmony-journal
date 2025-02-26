
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function LogSymptoms() {
  const navigate = useNavigate();
  const [selectedSide, setSelectedSide] = useState<string>("");
  const [customSymptom, setCustomSymptom] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="flex items-center justify-between mb-6">
        <button className="text-gray-400" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h1 className="text-xl font-semibold">Associated Symptoms</h1>
        <button className="text-gray-400">
          <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
        </button>
      </header>

      <main className="space-y-6">
        <section id="common-symptoms" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Common Symptoms</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Nausea', 'Vomiting', 'Dizziness', 'Pins & Needles'].map((symptom) => (
              <label key={symptom} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                <input type="checkbox" className="form-checkbox rounded bg-gray-600 border-gray-500 text-primary" />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </section>

        <section id="functional-difficulties" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Functional Difficulties</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Speech Difficulty', 'Swallowing Difficulty'].map((difficulty) => (
              <label key={difficulty} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                <input type="checkbox" className="form-checkbox rounded bg-gray-600 border-gray-500 text-primary" />
                <span>{difficulty}</span>
              </label>
            ))}
          </div>
        </section>

        <section id="visual-disturbances" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Visual Disturbances</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Seeing Stars', 'Dark Spots', 'Line Patterns'].map((disturbance) => (
              <label key={disturbance} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                <input type="checkbox" className="form-checkbox rounded bg-gray-600 border-gray-500 text-primary" />
                <span>{disturbance}</span>
              </label>
            ))}
          </div>
        </section>

        <section id="sensory-sensitivity" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Sensory Sensitivity</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Sound Sensitivity', 'Light Sensitivity'].map((sensitivity) => (
              <label key={sensitivity} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                <input type="checkbox" className="form-checkbox rounded bg-gray-600 border-gray-500 text-primary" />
                <span>{sensitivity}</span>
              </label>
            ))}
          </div>
        </section>

        <section id="body-weakness" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Body Weakness</h2>
          <div className="space-y-3">
            {['Right Side', 'Left Side', 'Both Sides'].map((side) => (
              <label key={side} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600">
                <input 
                  type="radio" 
                  name="side" 
                  value={side}
                  checked={selectedSide === side}
                  onChange={(e) => setSelectedSide(e.target.value)}
                  className="form-radio bg-gray-600 border-gray-500 text-primary"
                />
                <span>{side}</span>
              </label>
            ))}
          </div>
        </section>

        <section id="custom-symptom" className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-primary">Custom Symptom</h2>
          <div className="relative">
            <input 
              type="text" 
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              maxLength={50} 
              placeholder="Enter custom symptom" 
              className="w-full bg-gray-700/30 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-400"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-6 flex justify-center">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg shadow-lg">
          Save Symptoms
        </Button>
      </footer>
    </div>
  );
}
