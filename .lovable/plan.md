
# AI Premium Report — Correlations & Treatment Effectiveness

Build the missing AI narrative report (Premium tier only). It will analyze every variable captured in the app, surface statistical correlations/associations, and produce a dedicated treatment effectiveness assessment. Output is a downloadable PDF the user can share with their clinician.

## Report Proforma (8 sections)

1. **Executive Summary** — 1 paragraph: episode count, date range, dominant pattern, top trigger, most effective treatment, any safety flags.
2. **Episode Overview** *(data)* — totals, frequency/month, avg intensity, avg duration, location distribution.
3. **Correlation & Association Analysis** *(AI narrative + table)* — for each variable family below, compute statistical signal, then have AI explain it in plain language:
   - **Triggers ↔ pain intensity / duration / frequency** (odds ratio, lift vs baseline, avg hours before onset)
   - **Symptoms ↔ episode severity** (co-occurrence %, avg pain when present vs absent)
   - **Sleep (unified_health_data) ↔ next-day headache** (avg sleep duration/quality on headache days vs non-headache days)
   - **Menstrual phase ↔ episode occurrence** (phase-stratified rate)
   - **Weather (when logged) ↔ onset** (condition frequency on headache days)
   - **Stress / lifestyle variables ↔ intensity**
   - **Pain location ↔ trigger pattern** (e.g., neck-origin episodes vs trigger profile)
   - Each finding tagged: **Strong / Moderate / Weak / Insufficient data**, with sample size and a "correlation ≠ causation" reminder.
4. **Treatment & Management Effectiveness** *(AI narrative + table)* — dedicated section:
   - Per treatment (medication, meditation, massage, exercise, custom): usage count, avg relief time, effectiveness rate (effective / partial / not effective), avg pain reduction, side-effect profile.
   - Comparative ranking (best → worst by effectiveness rate, weighted by sample size).
   - **Timing analysis** — does early treatment (treatment_timing within X min of onset) shorten duration?
   - **Medication overuse warning** — flag if any med exceeds monthly threshold (reuse `useMedicationAnalysis` thresholds).
   - **Neck-pain treatment subgroup** — effectiveness in neck-origin vs non-neck episodes.
5. **Pattern Insights** *(AI narrative)* — temporal patterns (time of day, day of week, monthly), trend direction (improving/worsening over period).
6. **Red Flag Screening History** *(data)* — SNOOP flags raised during period, acknowledged status.
7. **Suggested Questions for Your Provider** *(AI narrative)* — 5–7 personalized questions derived from the findings above.
8. **Legal Disclaimer** — existing `ai-premium-report` v1.0.0 from `legalContent.ts`.

## Technical Implementation

**New edge function:** `supabase/functions/generate-ai-report/index.ts`
- Auth: extract JWT, verify user, check Premium entitlement.
- Aggregates server-side from `headache_episodes`, `episode_locations`, `unified_health_data`, `red_flags` over user-selected date range (default: last 90 days).
- Computes statistics in Deno (no client trust): trigger lift = P(high-pain | trigger) / P(high-pain); odds ratios for binary associations; phase-stratified rates; sleep deltas.
- Calls Lovable AI Gateway (`google/gemini-2.5-pro` for nuance) with structured tool-calling to return JSON sections (executive_summary, correlation_findings[], treatment_assessment[], pattern_insights, suggested_questions[]).
- Returns JSON `{ stats, narrative }`.

**New hook:** `src/hooks/useAiReport.ts` — invokes the function, manages loading/error/rate-limit (402/429) states.

**New component:** `src/components/export/AiPremiumReport.tsx`
- Premium gate (reuse `isPremium` flag pattern from `HeadacheDataExport`).
- Date-range picker (reuse `DateRangeSelector`).
- "Generate Report" button → loading state → preview panel → "Download PDF" button.
- PDF generation client-side via `jsPDF` (already in project), rendering the 8 sections + tables + disclaimer.

**Integration point:** add a new tab/card in `src/pages/DataExport.tsx` next to the existing rule-based export, labeled "AI Premium Report".

**Statistical methods (kept simple & defensible):**
- Lift / relative risk for binary variables (trigger present vs absent).
- Pearson correlation for numeric pairs (sleep hours vs intensity).
- Stratified rates for categorical (menstrual phase, weather).
- Minimum sample size threshold (n ≥ 5) before reporting; otherwise label "insufficient data".

**No DB schema changes required.** Reuses existing tables and Premium flag.

## Files to create/edit

- create `supabase/functions/generate-ai-report/index.ts`
- create `src/hooks/useAiReport.ts`
- create `src/components/export/AiPremiumReport.tsx`
- edit `src/pages/DataExport.tsx` (add tab)

## Out of scope (this round)

- Storing generated reports (can add `ai_reports` table later for history).
- Email delivery of report.
- Multi-language output.

Approve and I'll build it.
