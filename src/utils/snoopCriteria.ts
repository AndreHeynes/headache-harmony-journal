export interface SnoopCriterionDefinition {
  criterion: string;
  letter: string;
  name: string;
  description: string;
  screeningQuestion: string;
  clinicalConcern: string;
}

/**
 * Canonical SNOOP red flag criteria screened in the headache logging flow.
 * Used for clinical exports so a provider sees the complete list, including
 * criteria that were screened and NOT triggered.
 */
export const SNOOP_CRITERIA: SnoopCriterionDefinition[] = [
  {
    criterion: 'S_systemic',
    letter: 'S',
    name: 'Systemic symptoms / signs',
    description: 'Fever, chills, night sweats, unexplained weight loss, stiff neck or new rash accompanying the headache.',
    screeningQuestion: 'Do you have fever, chills, night sweats or unexplained weight loss? If yes: stiff neck or new rash?',
    clinicalConcern: 'Infection (meningitis), systemic illness, malignancy, giant cell arteritis.',
  },
  {
    criterion: 'N_neuro',
    letter: 'N',
    name: 'Neurological symptoms or signs',
    description: 'Weakness, numbness, speech difficulty, confusion or vision changes, with or without sudden onset.',
    screeningQuestion: 'Any weakness, numbness, difficulty speaking, confusion or vision changes? If yes: did they start suddenly?',
    clinicalConcern: 'Stroke, intracranial mass, haemorrhage, demyelinating disease.',
  },
  {
    criterion: 'O_onset',
    letter: 'O',
    name: 'Onset — sudden / thunderclap',
    description: 'Headache reaching peak intensity in under one minute, and whether it was the worst headache ever experienced.',
    screeningQuestion: 'Did the headache reach maximum intensity in less than 1 minute? If yes: worst headache of your life?',
    clinicalConcern: 'Subarachnoid haemorrhage, arterial dissection, reversible cerebral vasoconstriction.',
  },
  {
    criterion: 'O_age',
    letter: 'O',
    name: 'Older age at onset (>50)',
    description: 'First-ever headache beginning after age 50, derived from the recorded date of birth.',
    screeningQuestion: 'Is this the first headache you have ever experienced in your life?',
    clinicalConcern: 'Giant cell arteritis, secondary headache, intracranial mass.',
  },
  {
    criterion: 'P_pattern',
    letter: 'P',
    name: 'Pattern change / progression',
    description: 'Headache that differs from the usual pattern, and whether it is progressively worsening over days or weeks.',
    screeningQuestion: 'Is this headache different from your usual headaches? If yes: is it progressively getting worse?',
    clinicalConcern: 'Space-occupying lesion, raised intracranial pressure, medication overuse.',
  },
  {
    criterion: 'P_positional',
    letter: 'P',
    name: 'Positional / precipitated by Valsalva',
    description: 'Headache worse when lying down or standing, or provoked by coughing, straining or exertion; papilledema if known.',
    screeningQuestion: 'Is the headache worse lying down/standing, or with coughing or exertion? If yes: known papilledema?',
    clinicalConcern: 'Raised or low intracranial pressure, CSF leak, posterior fossa lesion.',
  },
];

export interface SnoopCriterionSummary extends SnoopCriterionDefinition {
  triggeredCount: number;
  highestPriority: 'high' | 'medium' | 'low' | null;
  lastTriggered: string | null;
  observedLabels: string[];
}

interface FlagLike {
  date: string;
  flags: Array<{ criterion?: string; label: string; detail: string; priority: string }>;
}

/** Build a full SNOOP summary: every criterion, triggered or not. */
export function summarizeSnoop(redFlags: FlagLike[]): SnoopCriterionSummary[] {
  const rank = { low: 1, medium: 2, high: 3 } as const;

  return SNOOP_CRITERIA.map((def) => {
    let triggeredCount = 0;
    let highestPriority: 'high' | 'medium' | 'low' | null = null;
    let lastTriggered: string | null = null;
    const observedLabels = new Set<string>();

    redFlags.forEach((rf) => {
      rf.flags.forEach((f) => {
        const matches = f.criterion
          ? f.criterion === def.criterion
          : f.label.toLowerCase().includes(def.name.split(' ')[0].toLowerCase());
        if (!matches) return;
        triggeredCount += 1;
        observedLabels.add(f.label);
        const p = (f.priority as 'high' | 'medium' | 'low') || 'low';
        if (!highestPriority || rank[p] > rank[highestPriority]) highestPriority = p;
        if (!lastTriggered || new Date(rf.date) > new Date(lastTriggered)) lastTriggered = rf.date;
      });
    });

    return {
      ...def,
      triggeredCount,
      highestPriority,
      lastTriggered,
      observedLabels: Array.from(observedLabels),
    };
  });
}
