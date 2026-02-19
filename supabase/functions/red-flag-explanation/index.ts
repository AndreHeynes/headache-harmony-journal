import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { flags } = await req.json();

    if (!flags || flags.length === 0) {
      return new Response(
        JSON.stringify({ explanation: "" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const flagSummary = flags
      .map((f: any) => `- ${f.label} (${f.priority} priority): ${f.detail}`)
      .join("\n");

    const prompt = `You are a compassionate health communication assistant embedded in a headache tracking journal app. The user has just logged a headache and the screening system detected the following warning signs based on SNOOP/SNOOPP clinical criteria:

${flagSummary}

Write a brief (3-4 sentences), empathetic, non-diagnostic explanation for the user. Use plain language. Explain what the detected signs could mean in general terms and recommend they see a healthcare provider. Do NOT diagnose. End with a reassuring statement. Keep the tone neutral, warm, and professional.`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a compassionate health communication assistant. Keep responses brief, empathetic, and non-diagnostic. Always include a disclaimer that this is not a diagnosis." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway returned ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in red-flag-explanation:", error);
    return new Response(
      JSON.stringify({ explanation: "", error: error.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
