
import { Checkbox } from "@/components/ui/checkbox";

export function StressTriggersSection() {
  const stressTypes = ["Physical", "Emotional", "Psychological", "Family", "Financial", "Social"];

  return (
    <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Stress Triggers</h2>
      <div className="grid grid-cols-2 gap-3">
        {stressTypes.map((type) => (
          <label key={type} className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
            <Checkbox className="border-gray-500 data-[state=checked]:bg-primary" />
            <span className="text-gray-300">{type}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
