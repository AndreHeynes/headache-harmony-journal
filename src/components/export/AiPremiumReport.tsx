import { useState } from "react";
import { jsPDF } from "jspdf";
import { addDays, format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Sparkles, Download, AlertTriangle, Lock, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useAiReport } from "@/hooks/useAiReport";
import { getDisclaimer } from "@/utils/legalContent";

interface Props {
  isPremium?: boolean;
}

const strengthVariant: Record<string, string> = {
  Strong: "bg-teal-600/20 text-teal-300 border-teal-600/40",
  Moderate: "bg-amber-600/20 text-amber-300 border-amber-600/40",
  Weak: "bg-gray-600/20 text-gray-300 border-gray-600/40",
  "Insufficient data": "bg-gray-700/30 text-gray-400 border-gray-600/30",
};

export function AiPremiumReport({ isPremium = false }: Props) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  const { generate, loading, error, report } = useAiReport();

  const handleGenerate = async () => {
    if (!range?.from || !range?.to) {
      toast.error("Please select a date range");
      return;
    }
    const result = await generate(range.from, range.to);
    if (result) toast.success("AI report generated");
  };

  const handleDownload = () => {
    if (!report) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = margin;

    const writeWrapped = (text: string, size = 11, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > 800) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += size + 4;
      });
    };

    const heading = (text: string) => { y += 8; writeWrapped(text, 14, true); y += 2; };
    const sub = (text: string) => writeWrapped(text, 12, true);

    writeWrapped("AI Premium Headache Report", 18, true);
    writeWrapped(
      `Period: ${format(range!.from!, "MMM d, yyyy")} – ${format(range!.to!, "MMM d, yyyy")}`,
      10
    );
    writeWrapped(`Generated: ${format(new Date(), "PPP p")}`, 10);

    heading("1. Executive Summary");
    writeWrapped(report.narrative.executive_summary);

    heading("2. Episode Overview");
    const o = report.stats.overview;
    writeWrapped(`Total episodes: ${o.total_episodes}`);
    writeWrapped(`Average pain intensity: ${o.avg_pain}/10`);
    writeWrapped(`Average duration: ${o.avg_duration_min} min`);
    writeWrapped(`High-pain episodes (≥7): ${o.high_pain_pct}%`);

    heading("3. Correlation & Association Analysis");
    report.narrative.correlation_findings.forEach((f) => {
      sub(`${f.variable} — ${f.strength} (n=${f.sample_size})`);
      writeWrapped(f.finding);
    });
    writeWrapped("Note: Correlation does not imply causation.", 9);

    heading("4. Treatment & Management Effectiveness");
    writeWrapped(report.narrative.treatment_assessment.summary);
    sub("Ranking commentary:");
    writeWrapped(report.narrative.treatment_assessment.ranking_commentary);
    sub("Timing insight:");
    writeWrapped(report.narrative.treatment_assessment.timing_insight);
    sub("Overuse:");
    writeWrapped(report.narrative.treatment_assessment.overuse_warning);

    sub("Per-treatment data:");
    report.stats.treatmentEffectiveness.forEach((t: any) => {
      writeWrapped(
        `• ${t.name} — used ${t.usage_count}x | effectiveness: ${
          t.effectiveness_rate_pct ?? "n/a"
        }% | avg duration: ${t.avg_duration_min ?? "n/a"} min | effective ${t.effective}, partial ${t.partially_effective}, not effective ${t.not_effective}`
      );
    });

    heading("5. Pattern Insights");
    writeWrapped(report.narrative.pattern_insights);

    heading("6. Red Flag Screening History");
    if (report.redFlags.length === 0) writeWrapped("No red flags raised in this period.");
    else
      report.redFlags.forEach((rf) =>
        writeWrapped(
          `• ${format(new Date(rf.created_at), "PP")} — ${rf.flag_type} (${rf.priority_level})${rf.acknowledged ? " — acknowledged" : ""}`
        )
      );

    heading("7. Suggested Questions for Your Provider");
    report.narrative.suggested_questions.forEach((q, i) => writeWrapped(`${i + 1}. ${q}`));

    heading("8. Legal Disclaimer");
    const disc = getDisclaimer("ai-premium-report");
    if (disc) writeWrapped(disc.content, 8);

    doc.save(`ai-headache-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  if (!isPremium) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-teal-400" /> AI Premium Report
          </CardTitle>
          <CardDescription className="text-gray-400">
            Available to Premium subscribers. During the beta phase, all premium features are unlocked.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-teal-400" /> AI Premium Report
        </CardTitle>
        <CardDescription className="text-gray-400">
          AI-generated narrative report covering correlations across all logged variables and a dedicated treatment effectiveness assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-gray-700/40 border-gray-600 text-white">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {range?.from && range?.to
                  ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={2}
                initialFocus
                className="bg-gray-800 text-white"
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleGenerate} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "Analyzing…" : "Generate Report"}
          </Button>

          {report && (
            <Button onClick={handleDownload} variant="outline" className="bg-gray-700/40 border-gray-600 text-white">
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-700/40 rounded text-sm text-red-300">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {report && (
          <div className="space-y-5 text-sm">
            <Section title="Executive Summary">
              <p className="text-gray-300 leading-relaxed">{report.narrative.executive_summary}</p>
            </Section>

            <Section title="Episode Overview">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-300">
                <Stat label="Episodes" value={String(report.stats.overview.total_episodes)} />
                <Stat label="Avg pain" value={`${report.stats.overview.avg_pain}/10`} />
                <Stat label="Avg duration" value={`${report.stats.overview.avg_duration_min} min`} />
                <Stat label="High-pain" value={`${report.stats.overview.high_pain_pct}%`} />
              </div>
            </Section>

            <Section title="Correlation & Association Analysis">
              <div className="space-y-3">
                {report.narrative.correlation_findings.map((f, i) => (
                  <div key={i} className="p-3 rounded border border-gray-700 bg-gray-900/40">
                    <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                      <span className="font-medium text-white">{f.variable}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">n={f.sample_size}</span>
                        <Badge variant="outline" className={strengthVariant[f.strength]}>{f.strength}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-300">{f.finding}</p>
                  </div>
                ))}
                <p className="text-xs text-gray-500 italic">Correlation does not imply causation.</p>
              </div>
            </Section>

            <Section title="Treatment & Management Effectiveness">
              <p className="text-gray-300 mb-3">{report.narrative.treatment_assessment.summary}</p>
              <div className="space-y-2">
                <SubLine label="Ranking" text={report.narrative.treatment_assessment.ranking_commentary} />
                <SubLine label="Timing" text={report.narrative.treatment_assessment.timing_insight} />
                <SubLine label="Overuse" text={report.narrative.treatment_assessment.overuse_warning} />
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-3">Treatment</th>
                      <th className="py-2 pr-3">Uses</th>
                      <th className="py-2 pr-3">Effective</th>
                      <th className="py-2 pr-3">Partial</th>
                      <th className="py-2 pr-3">Not eff.</th>
                      <th className="py-2 pr-3">Rate</th>
                      <th className="py-2 pr-3">Avg dur.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.stats.treatmentEffectiveness.map((t: any) => (
                      <tr key={t.name} className="text-gray-300 border-b border-gray-800">
                        <td className="py-2 pr-3">{t.name}</td>
                        <td className="py-2 pr-3">{t.usage_count}</td>
                        <td className="py-2 pr-3">{t.effective}</td>
                        <td className="py-2 pr-3">{t.partially_effective}</td>
                        <td className="py-2 pr-3">{t.not_effective}</td>
                        <td className="py-2 pr-3">{t.effectiveness_rate_pct ?? "—"}{t.effectiveness_rate_pct != null ? "%" : ""}</td>
                        <td className="py-2 pr-3">{t.avg_duration_min ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Pattern Insights">
              <p className="text-gray-300 leading-relaxed">{report.narrative.pattern_insights}</p>
            </Section>

            <Section title="Suggested Questions for Your Provider">
              <ul className="list-decimal list-inside space-y-1 text-gray-300">
                {report.narrative.suggested_questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </Section>

            <p className="text-xs text-gray-500 italic">
              This AI-generated report is informational only and is not a medical diagnosis. Always consult a qualified healthcare provider.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded border border-gray-700 bg-gray-900/40">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function SubLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="text-gray-300">
      <span className="text-teal-400 font-medium">{label}: </span>
      <span>{text}</span>
    </div>
  );
}