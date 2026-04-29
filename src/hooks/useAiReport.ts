import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CorrelationFinding {
  variable: string;
  finding: string;
  strength: "Strong" | "Moderate" | "Weak" | "Insufficient data";
  sample_size: number;
}

export interface AiReportData {
  stats: any;
  narrative: {
    executive_summary: string;
    correlation_findings: CorrelationFinding[];
    treatment_assessment: {
      summary: string;
      ranking_commentary: string;
      timing_insight: string;
      overuse_warning: string;
    };
    pattern_insights: string;
    suggested_questions: string[];
  };
  redFlags: Array<{ flag_type: string; priority_level: string; acknowledged: boolean; created_at: string }>;
}

export function useAiReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AiReportData | null>(null);

  const generate = async (from: Date, to: Date) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-ai-report", {
        body: { from: from.toISOString(), to: to.toISOString() },
      });
      if (fnError) {
        // Surface backend error message when present
        const ctx: any = (fnError as any).context;
        let msg = fnError.message || "Failed to generate report";
        try {
          if (ctx?.body) {
            const parsed = typeof ctx.body === "string" ? JSON.parse(ctx.body) : ctx.body;
            if (parsed?.error) msg = parsed.error;
          }
        } catch { /* ignore */ }
        throw new Error(msg);
      }
      if ((data as any)?.error) throw new Error((data as any).error);
      setReport(data as AiReportData);
      return data as AiReportData;
    } catch (e: any) {
      const msg = e?.message ?? "Unknown error";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, report };
}