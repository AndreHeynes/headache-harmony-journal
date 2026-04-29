import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Episode {
  id: string;
  start_time: string;
  end_time: string | null;
  pain_intensity: number | null;
  duration_minutes: number | null;
  pain_location: string | null;
  symptoms: string[] | null;
  triggers: string[] | null;
  treatment: any;
  treatment_timing: string | null;
  treatment_outcome: string | null;
  notes: string | null;
}

interface HealthRow {
  date: string;
  data_type: string;
  sleep_duration_minutes: number | null;
  sleep_quality_score: number | null;
  menstrual_phase: string | null;
}

function clean(name: string): string {
  return name
    .replace(/\s*\(\d+(?:\.\d+)?h?\s*before\)/i, "")
    .replace(/\s*\[\d+\s*min\]/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 5) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? null : Math.round((num / den) * 100) / 100;
}

function strength(score: number): "Strong" | "Moderate" | "Weak" {
  const a = Math.abs(score);
  if (a >= 0.5) return "Strong";
  if (a >= 0.3) return "Moderate";
  return "Weak";
}

function liftStrength(lift: number, n: number): "Strong" | "Moderate" | "Weak" | "Insufficient data" {
  if (n < 5) return "Insufficient data";
  if (lift >= 1.5 || lift <= 0.67) return "Strong";
  if (lift >= 1.2 || lift <= 0.83) return "Moderate";
  return "Weak";
}

function computeStats(episodes: Episode[], health: HealthRow[]) {
  const total = episodes.length;
  const HIGH_PAIN = 7;
  const baseHigh = episodes.filter(e => (e.pain_intensity ?? 0) >= HIGH_PAIN).length / Math.max(total, 1);

  // Trigger correlations
  const trigMap = new Map<string, { n: number; high: number; pains: number[]; durations: number[] }>();
  episodes.forEach(ep => {
    (ep.triggers || []).forEach(raw => {
      const name = clean(raw);
      if (!name) return;
      const e = trigMap.get(name) || { n: 0, high: 0, pains: [], durations: [] };
      e.n++;
      if ((ep.pain_intensity ?? 0) >= HIGH_PAIN) e.high++;
      if (ep.pain_intensity != null) e.pains.push(ep.pain_intensity);
      if (ep.duration_minutes != null) e.durations.push(ep.duration_minutes);
      trigMap.set(name, e);
    });
  });
  const triggerCorrelations = Array.from(trigMap.entries())
    .map(([name, d]) => {
      const pHigh = d.high / d.n;
      const lift = baseHigh > 0 ? Math.round((pHigh / baseHigh) * 100) / 100 : 1;
      return {
        name,
        occurrences: d.n,
        avg_pain: d.pains.length ? Math.round((d.pains.reduce((a, b) => a + b, 0) / d.pains.length) * 10) / 10 : 0,
        avg_duration_min: d.durations.length ? Math.round(d.durations.reduce((a, b) => a + b, 0) / d.durations.length) : 0,
        lift,
        strength: liftStrength(lift, d.n),
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 12);

  // Symptom co-occurrence
  const symMap = new Map<string, { n: number; pains: number[] }>();
  episodes.forEach(ep => {
    (ep.symptoms || []).forEach(raw => {
      const name = clean(raw);
      if (!name || name.startsWith("Pain:")) return;
      const e = symMap.get(name) || { n: 0, pains: [] };
      e.n++;
      if (ep.pain_intensity != null) e.pains.push(ep.pain_intensity);
      symMap.set(name, e);
    });
  });
  const allPainAvg = episodes.filter(e => e.pain_intensity != null).reduce((s, e) => s + (e.pain_intensity ?? 0), 0) / Math.max(total, 1);
  const symptomPatterns = Array.from(symMap.entries())
    .map(([name, d]) => {
      const avgWith = d.pains.length ? d.pains.reduce((a, b) => a + b, 0) / d.pains.length : 0;
      return {
        name,
        occurrences: d.n,
        pct_of_episodes: Math.round((d.n / Math.max(total, 1)) * 100),
        avg_pain_when_present: Math.round(avgWith * 10) / 10,
        delta_vs_baseline: Math.round((avgWith - allPainAvg) * 10) / 10,
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 10);

  // Treatment effectiveness
  const txMap = new Map<string, {
    n: number; effective: number; partial: number; not_effective: number;
    durations: number[]; sideEffects: Map<string, number>;
  }>();
  episodes.forEach(ep => {
    const t = ep.treatment;
    if (!t) return;
    let names: string[] = [];
    if (Array.isArray(t)) names = t.filter((x: any) => typeof x === "string");
    else if (typeof t === "object") {
      if (t.medications) names = Array.isArray(t.medications) ? t.medications.map((m: any) => typeof m === "string" ? m : m.name).filter(Boolean) : [t.medications];
      if (t.type) names.push(t.type);
      if (t.otherTreatments) names.push(...(Array.isArray(t.otherTreatments) ? t.otherTreatments : []));
    }
    const outcome = ep.treatment_outcome || t?.treatment_outcome;
    const sideEffects: string[] = (typeof t === "object" && Array.isArray(t.sideEffects)) ? t.sideEffects : [];
    names.forEach(rawName => {
      const name = (rawName || "").toString().trim();
      if (!name) return;
      const e = txMap.get(name) || { n: 0, effective: 0, partial: 0, not_effective: 0, durations: [], sideEffects: new Map() };
      e.n++;
      if (outcome === "effective") e.effective++;
      else if (outcome === "partially_effective") e.partial++;
      else if (outcome === "not_effective") e.not_effective++;
      if (ep.duration_minutes != null) e.durations.push(ep.duration_minutes);
      sideEffects.forEach(se => e.sideEffects.set(se, (e.sideEffects.get(se) || 0) + 1));
      txMap.set(name, e);
    });
  });
  const treatmentEffectiveness = Array.from(txMap.entries())
    .map(([name, d]) => {
      const ratedTotal = d.effective + d.partial + d.not_effective;
      const effectivenessRate = ratedTotal > 0
        ? Math.round(((d.effective + 0.5 * d.partial) / ratedTotal) * 100)
        : null;
      return {
        name,
        usage_count: d.n,
        effective: d.effective,
        partially_effective: d.partial,
        not_effective: d.not_effective,
        effectiveness_rate_pct: effectivenessRate,
        avg_duration_min: d.durations.length ? Math.round(d.durations.reduce((a, b) => a + b, 0) / d.durations.length) : null,
        side_effects: Array.from(d.sideEffects.entries()).map(([effect, count]) => ({ effect, count })),
      };
    })
    .sort((a, b) => (b.effectiveness_rate_pct ?? -1) - (a.effectiveness_rate_pct ?? -1));

  // Sleep vs headache day
  const headacheDays = new Set(episodes.map(e => e.start_time.slice(0, 10)));
  const sleepRows = health.filter(h => h.sleep_duration_minutes != null);
  const sleepOnHeadache: number[] = [];
  const sleepOnNon: number[] = [];
  sleepRows.forEach(h => {
    const next = new Date(h.date);
    next.setDate(next.getDate() + 1);
    const nextStr = next.toISOString().slice(0, 10);
    const mins = h.sleep_duration_minutes!;
    if (headacheDays.has(nextStr)) sleepOnHeadache.push(mins);
    else sleepOnNon.push(mins);
  });
  const avg = (a: number[]) => a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) / 6) / 10 : null; // hours, 1dp
  const sleepAssociation = {
    avg_sleep_hours_before_headache_day: avg(sleepOnHeadache),
    avg_sleep_hours_before_normal_day: avg(sleepOnNon),
    sample_size: sleepRows.length,
    strength: sleepOnHeadache.length >= 5 && sleepOnNon.length >= 5
      ? (Math.abs((avg(sleepOnHeadache) ?? 0) - (avg(sleepOnNon) ?? 0)) >= 0.5 ? "Moderate" : "Weak")
      : "Insufficient data",
  };

  // Sleep quality vs pain (Pearson)
  const pairs = sleepRows
    .map(h => {
      const next = new Date(h.date);
      next.setDate(next.getDate() + 1);
      const ep = episodes.find(e => e.start_time.slice(0, 10) === next.toISOString().slice(0, 10));
      if (!ep || ep.pain_intensity == null || h.sleep_quality_score == null) return null;
      return { x: h.sleep_quality_score, y: ep.pain_intensity };
    })
    .filter(Boolean) as Array<{ x: number; y: number }>;
  const sleepQualityPainCorr = pairs.length >= 5 ? {
    correlation: pearson(pairs.map(p => p.x), pairs.map(p => p.y)),
    sample_size: pairs.length,
  } : null;

  // Menstrual phase rates
  const phaseDays = new Map<string, number>();
  health.filter(h => h.menstrual_phase).forEach(h => {
    phaseDays.set(h.menstrual_phase!, (phaseDays.get(h.menstrual_phase!) || 0) + 1);
  });
  const phaseHeadaches = new Map<string, number>();
  health.filter(h => h.menstrual_phase && headacheDays.has(h.date)).forEach(h => {
    phaseHeadaches.set(h.menstrual_phase!, (phaseHeadaches.get(h.menstrual_phase!) || 0) + 1);
  });
  const menstrualAssociation = Array.from(phaseDays.entries()).map(([phase, days]) => ({
    phase,
    days_tracked: days,
    headache_days: phaseHeadaches.get(phase) || 0,
    rate_pct: Math.round(((phaseHeadaches.get(phase) || 0) / days) * 100),
  }));

  // Timing analysis (early treatment)
  const earlyVsLate = { early: [] as number[], late: [] as number[] };
  episodes.forEach(ep => {
    if (!ep.treatment_timing || ep.duration_minutes == null) return;
    const m = ep.treatment_timing.match(/(\d+)/);
    if (!m) return;
    const mins = parseInt(m[1], 10);
    if (mins <= 30) earlyVsLate.early.push(ep.duration_minutes);
    else earlyVsLate.late.push(ep.duration_minutes);
  });
  const treatmentTiming = {
    early_n: earlyVsLate.early.length,
    late_n: earlyVsLate.late.length,
    avg_duration_early_min: earlyVsLate.early.length ? Math.round(earlyVsLate.early.reduce((a, b) => a + b, 0) / earlyVsLate.early.length) : null,
    avg_duration_late_min: earlyVsLate.late.length ? Math.round(earlyVsLate.late.reduce((a, b) => a + b, 0) / earlyVsLate.late.length) : null,
  };

  // Episode overview
  const dates = episodes.map(e => e.start_time).sort();
  const overview = {
    total_episodes: total,
    date_from: dates[0] ?? null,
    date_to: dates[dates.length - 1] ?? null,
    avg_pain: total ? Math.round((allPainAvg) * 10) / 10 : 0,
    avg_duration_min: (() => {
      const ds = episodes.filter(e => e.duration_minutes != null);
      return ds.length ? Math.round(ds.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / ds.length) : 0;
    })(),
    high_pain_pct: Math.round(baseHigh * 100),
  };

  return {
    overview,
    triggerCorrelations,
    symptomPatterns,
    treatmentEffectiveness,
    sleepAssociation,
    sleepQualityPainCorr,
    menstrualAssociation,
    treatmentTiming,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const fromIso: string = body.from ?? new Date(Date.now() - 90 * 86400000).toISOString();
    const toIso: string = body.to ?? new Date().toISOString();

    const [{ data: episodes }, { data: health }, { data: redFlags }] = await Promise.all([
      supabase.from("headache_episodes").select("*").eq("user_id", userId).gte("start_time", fromIso).lte("start_time", toIso).order("start_time", { ascending: true }),
      supabase.from("unified_health_data").select("date,data_type,sleep_duration_minutes,sleep_quality_score,menstrual_phase").eq("user_id", userId).gte("date", fromIso.slice(0, 10)).lte("date", toIso.slice(0, 10)),
      supabase.from("red_flags").select("flag_type,priority_level,acknowledged,created_at").eq("user_id", userId).gte("created_at", fromIso).lte("created_at", toIso),
    ]);

    const eps = (episodes ?? []) as Episode[];
    if (eps.length === 0) {
      return new Response(JSON.stringify({ error: "No headache episodes in selected range." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const stats = computeStats(eps, (health ?? []) as HealthRow[]);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const systemPrompt = `You are a clinical data summarizer. Given pre-computed statistics from a patient's headache tracking, write a clear, factual narrative for a clinician.

Rules:
- Never diagnose. Use language like "associated with", "appears related to", "observed".
- Always remind that correlation does not imply causation.
- If sample size < 5 for any item, label as "insufficient data" and do not draw conclusions.
- Be concise, clinical, and patient-friendly.
- Quote exact numbers from the stats.`;

    const userPrompt = `Statistics for the period ${fromIso} to ${toIso}:\n\n${JSON.stringify(stats, null, 2)}\n\nRed flag events: ${JSON.stringify(redFlags ?? [])}\n\nGenerate the report now.`;

    const tool = {
      type: "function",
      function: {
        name: "build_report",
        description: "Return the structured AI premium report.",
        parameters: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            correlation_findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  variable: { type: "string" },
                  finding: { type: "string" },
                  strength: { type: "string", enum: ["Strong", "Moderate", "Weak", "Insufficient data"] },
                  sample_size: { type: "number" },
                },
                required: ["variable", "finding", "strength", "sample_size"],
              },
            },
            treatment_assessment: {
              type: "object",
              properties: {
                summary: { type: "string" },
                ranking_commentary: { type: "string" },
                timing_insight: { type: "string" },
                overuse_warning: { type: "string" },
              },
              required: ["summary", "ranking_commentary", "timing_insight", "overuse_warning"],
            },
            pattern_insights: { type: "string" },
            suggested_questions: { type: "array", items: { type: "string" } },
          },
          required: ["executive_summary", "correlation_findings", "treatment_assessment", "pattern_insights", "suggested_questions"],
        },
      },
    };

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "build_report" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI returned no structured output" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const narrative = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ stats, narrative, redFlags: redFlags ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ai-report error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});