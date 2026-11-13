import { FlaskConical } from 'lucide-react';
import { getDemoScenario } from '@/lib/demoMode';
import { DEMO_SCENARIOS } from '@/lib/demoScenarios';

export function DemoModeBanner() {
  const scenario = DEMO_SCENARIOS[getDemoScenario()];
  return (
    <div className="border-b border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-foreground" role="status">
      <FlaskConical className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
      <strong>Sample only: fictional data</strong>
      <span className="text-muted-foreground"> · {scenario.label} · Changes stay in this tab and never reach an account.</span>
    </div>
  );
}
