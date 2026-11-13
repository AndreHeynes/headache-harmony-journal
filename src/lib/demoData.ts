import { DEMO_SCENARIOS, summarizeDemo, type DemoEpisode, type DemoScenarioId } from './demoScenarios';
import { REGION_LABELS } from './regionMapping';
import { DEMO_LOG_EPISODE_ID, DEMO_USER_ID } from './demoMode';
import type { AiReportData } from '@/hooks/useAiReport';

export type DemoRow = Record<string, any>;
export type DemoDatabase = Record<string, DemoRow[]>;

const iso = (date: string, hour: number, extraMinutes = 0) => {
  const value = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00.000Z`);
  value.setUTCMinutes(value.getUTCMinutes() + extraMinutes);
  return value.toISOString();
};

const treatmentFor = (episode: Pick<DemoEpisode, 'painMedicine' | 'outcome'>) => episode.painMedicine ? {
  type: 'Medication',
  medications: [{ name: 'Pain medicine', dosage: 'As labelled', timing: '30-40mins', effectiveness: episode.outcome === 'effective' ? 9 : episode.outcome === 'partially_effective' ? 6 : 2 }],
  otherTreatments: ['Rest'],
  treatment_timing: '30-40mins',
  relief_timing: '60-plus',
  treatment_outcome: episode.outcome,
  classifications: ['Self-care'],
} : {
  type: 'Meditation', otherTreatments: ['Rest'], treatment_outcome: episode.outcome,
};

function completedRows(id: DemoScenarioId): { episodes: DemoRow[]; locations: DemoRow[] } {
  const episodes: DemoRow[] = [];
  const locations: DemoRow[] = [];
  DEMO_SCENARIOS[id].episodes.forEach((episode, index) => {
    const episodeId = `demo-${id}-episode-${index + 1}`;
    const start = iso(episode.date, episode.hour);
    const treatment = treatmentFor(episode);
    const symptoms = index % 2 === 0
      ? ['Nausea (During headache)', 'Light Sensitivity (During headache)']
      : ['Neck Pain (Before headache)'];
    episodes.push({
      id: episodeId, user_id: DEMO_USER_ID, status: 'completed', start_time: start,
      end_time: iso(episode.date, episode.hour, episode.minutes), duration_minutes: episode.minutes,
      pain_location: episode.areas.map(a => REGION_LABELS[a.region]).join(', '),
      pain_intensity: episode.intensity, symptoms, triggers: episode.triggers,
      treatment, treatment_timing: episode.painMedicine ? '30-40mins' : 'immediately',
      relief_timing: episode.painMedicine ? '60-plus' : '30-40mins', treatment_outcome: episode.outcome,
      notes: 'Fictional sample entry', created_at: start, updated_at: start,
    });
    episode.areas.forEach((area, areaIndex) => {
      const firstSelected = iso(episode.date, episode.hour, area.minutesAfterStart);
      locations.push({
        id: `${episodeId}-area-${areaIndex + 1}`, episode_id: episodeId, user_id: DEMO_USER_ID,
        location_name: REGION_LABELS[area.region], location_key: `region:${area.region}`, region_id: area.region,
        deselected_at: null, is_origin: area.order === 1, selection_order: area.order,
        first_selected_at: firstSelected, pain_intensity: Math.max(1, episode.intensity - areaIndex),
        symptoms, triggers: episode.triggers, variables: null, treatment,
        treatment_timing: episode.painMedicine ? '30-40mins' : 'immediately',
        relief_timing: episode.painMedicine ? '60-plus' : '30-40mins', treatment_outcome: episode.outcome,
        notes: 'Fictional area detail', created_at: firstSelected, updated_at: firstSelected,
      });
    });
  });
  return { episodes, locations };
}

function logRows(): { episode: DemoRow; locations: DemoRow[] } {
  const start = '2026-11-13T09:00:00.000Z';
  const triggers = ['Stress: Family (6h before)', 'Food: Skipped lunch (5h before)', 'Activity: Screen work (2h before) [180 min]'];
  const symptoms = ['Pain: Throbbing', 'Nausea (During headache)', 'Light Sensitivity (During headache)', 'Neck Pain (Before headache)'];
  const treatment = treatmentFor({ painMedicine: true, outcome: 'partially_effective' } as DemoEpisode);
  const episode = {
    id: DEMO_LOG_EPISODE_ID, user_id: DEMO_USER_ID, status: 'active', start_time: start,
    end_time: '2026-11-13T12:00:00.000Z', duration_minutes: 180,
    pain_location: 'Left temple, Left eye, Top of head', pain_intensity: 7,
    symptoms, triggers, treatment, treatment_timing: '30-40mins', relief_timing: '60-plus',
    treatment_outcome: 'partially_effective', notes: 'Fictional log demonstration',
    created_at: start, updated_at: start,
  };
  const locations = ['l-temple', 'l-eye', 'crown'].map((region, index) => ({
    id: `demo-log-area-${index + 1}`, episode_id: DEMO_LOG_EPISODE_ID, user_id: DEMO_USER_ID,
    location_name: REGION_LABELS[region], location_key: `region:${region}`, region_id: region,
    deselected_at: null, is_origin: index === 0, selection_order: index + 1,
    first_selected_at: iso('2026-11-13', 9, index * 20), pain_intensity: 7 - index,
    symptoms, triggers, variables: null, treatment, treatment_timing: '30-40mins', relief_timing: '60-plus',
    treatment_outcome: 'partially_effective', notes: 'Fictional area detail',
    created_at: iso('2026-11-13', 9, index * 20), updated_at: iso('2026-11-13', 9, index * 20),
  }));
  return { episode, locations };
}

export function createDemoDatabase(id: DemoScenarioId): DemoDatabase {
  const completed = completedRows(id);
  const log = logRows();
  const health = DEMO_SCENARIOS[id].episodes.map((episode, index) => ({
    id: `demo-health-${index + 1}`, user_id: DEMO_USER_ID, date: episode.date,
    data_type: 'sleep', source: 'manual', sleep_duration_minutes: Math.round(episode.sleepHours * 60),
    sleep_quality_score: 60 + index * 3, resting_heart_rate: 62, hrv: 48,
    created_at: iso(episode.date, 7), updated_at: iso(episode.date, 7),
  }));
  health.push({
    id: 'demo-health-today', user_id: DEMO_USER_ID, date: '2026-11-13', data_type: 'sleep', source: 'manual',
    sleep_duration_minutes: 390, sleep_quality_score: 72, resting_heart_rate: 62, hrv: 48,
    created_at: '2026-11-13T07:00:00.000Z', updated_at: '2026-11-13T07:00:00.000Z',
  });
  return {
    headache_episodes: [...completed.episodes, log.episode],
    episode_locations: [...completed.locations, ...log.locations],
    profiles: [{
      id: DEMO_USER_ID, email: 'sample@example.invalid', full_name: 'Sample User', date_of_birth: '1990-01-15',
      subscription_tier: 'premium', premium_expires_at: '2027-01-08T23:59:59.000Z',
      created_at: '2026-11-01T09:00:00.000Z', updated_at: '2026-11-13T09:00:00.000Z',
    }],
    unified_health_data: health,
    health_tracker_connections: [],
    red_flags: [{
      id: `demo-red-flag-${id}`, user_id: DEMO_USER_ID, episode_id: completed.episodes[0]?.id,
      flag_type: 'snoop_screening', priority_level: 'low',
      flag_details: { flags: [{ criterion: 'P_pattern', label: 'Pattern Change', detail: 'Fictional pattern-change example; not a diagnosis.', priority: 'low' }] },
      screening_responses: { hasPatternChange: true, isWorsening: false },
      acknowledged: true, created_at: completed.episodes[0]?.start_time || '2026-11-01T09:00:00.000Z',
    }],
    campaign_events: [],
  };
}

export function createDemoAiReport(id: DemoScenarioId): AiReportData {
  const scenario = DEMO_SCENARIOS[id];
  const summary = summarizeDemo(id);
  const n = summary.episodes;
  const sufficient = n >= 5;
  const rated = scenario.episodes.filter(e => e.painMedicine && e.outcome);
  const count = (outcome: string) => rated.filter(e => e.outcome === outcome).length;
  const uses = scenario.episodes.filter(e => e.painMedicine).length;
  return {
    stats: {
      overview: {
        total_episodes: n, avg_pain: summary.meanIntensity, avg_duration_min: Math.round(summary.hours * 60 / Math.max(1, n)),
        high_pain_pct: Math.round(100 * scenario.episodes.filter(e => e.intensity >= 7).length / Math.max(1, n)),
      },
      treatmentEffectiveness: [{
        name: 'Pain medicine', usage_count: uses, effectiveness_rate_pct: summary.effectiveRatePct,
        avg_duration_min: Math.round(summary.hours * 60 / Math.max(1, n)), effective: count('effective'),
        partially_effective: count('partially_effective'), not_effective: count('not_effective'),
      }],
    },
    narrative: {
      executive_summary: `This fictional ${scenario.label.toLowerCase()} contains ${n} completed episodes across ${summary.headacheDays} headache days. It demonstrates report layout only and cannot support medical conclusions.`,
      correlation_findings: [{
        variable: 'Reported stress and sleep', finding: sufficient
          ? 'Stress and shorter sleep appear alongside some higher-intensity entries in this fictional fixture. This is an association within invented data, not evidence of cause.'
          : `Only ${n} episodes are available; at least 5 are required before the report describes an association.`,
        strength: sufficient ? 'Weak' : 'Insufficient data', sample_size: n,
      }, {
        variable: 'Pain medicine and recorded outcome', finding: summary.recordedOutcomes
          ? `${summary.recordedOutcomes} fictional uses have a recorded outcome. Unrecorded outcomes are excluded from the rate.`
          : 'No rated treatment outcomes are available.',
        strength: summary.recordedOutcomes >= 5 ? 'Weak' : 'Insufficient data', sample_size: summary.recordedOutcomes,
      }],
      treatment_assessment: {
        summary: 'Pain medicine is shown as a generic treatment label. Outcomes are self-reported and missing outcomes are not guessed.',
        ranking_commentary: 'No comparative ranking is recommended from this small fictional dataset.',
        timing_insight: 'The fixture records treatment at 30–40 minutes after onset and relief at 60+ minutes; these entries do not establish effectiveness.',
        overuse_warning: `${summary.medDays} fictional medication-use days are recorded. The general counter threshold is 15 days per month; only a clinician can assess medication overuse headache.`,
      },
      pattern_insights: `${summary.spread.multiArea} episodes include multiple areas. Area timestamps describe when fictional areas were logged, not verified biological spread.`,
      suggested_questions: ['Which recorded patterns would be useful to review at my appointment?', 'How should I record treatment timing and outcomes more consistently?', 'Do my medication-use days need clinical review?'],
    },
    redFlags: [{ flag_type: 'snoop_screening', priority_level: 'low', acknowledged: true, created_at: scenario.episodes[0] ? iso(scenario.episodes[0].date, scenario.episodes[0].hour) : '2026-11-01T09:00:00.000Z' }],
  };
}
