import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("[schedule-beta-emails] Edge function loaded");

// Email schedule: [email_type, days_after_signup]
const EMAIL_SCHEDULE: [string, number][] = [
  ["welcome", 0],
  ["getting_started", 3],
  ["feature_discovery", 7],
  ["engagement_nudge", 14],
  ["mid_point_feedback", 28],
  ["power_user_tips", 42],
  ["beta_ending_soon", 52],
  ["final_feedback", 56],
];

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] schedule-beta-emails invoked`);

  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, full_name } = await req.json();

    if (!user_id || !email) {
      console.error(`[${requestId}] Missing required fields`);
      return new Response(
        JSON.stringify({ success: false, error: "user_id and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${requestId}] Scheduling emails for user: ${user_id}, email: ${email}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if emails are already scheduled for this user
    const { data: existingEmails, error: checkError } = await supabase
      .from("beta_email_queue")
      .select("id")
      .eq("user_id", user_id)
      .limit(1);

    if (checkError) {
      console.error(`[${requestId}] Error checking existing emails:`, checkError);
      return new Response(
        JSON.stringify({ success: false, error: checkError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingEmails && existingEmails.length > 0) {
      console.log(`[${requestId}] Emails already scheduled for user: ${user_id}`);
      return new Response(
        JSON.stringify({ success: true, message: "Emails already scheduled", skipped: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate scheduled dates and create queue entries
    const now = new Date();
    const emailEntries = EMAIL_SCHEDULE.map(([email_type, daysAfter]) => {
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + daysAfter);
      
      return {
        user_id,
        email,
        full_name: full_name || null,
        email_type,
        scheduled_for: scheduledDate.toISOString(),
        status: "pending",
      };
    });

    console.log(`[${requestId}] Inserting ${emailEntries.length} scheduled emails`);

    const { data: insertedEmails, error: insertError } = await supabase
      .from("beta_email_queue")
      .insert(emailEntries)
      .select();

    if (insertError) {
      console.error(`[${requestId}] Error inserting emails:`, insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${requestId}] Successfully scheduled ${insertedEmails?.length || 0} emails`);

    return new Response(
      JSON.stringify({
        success: true,
        scheduled: insertedEmails?.length || 0,
        emails: emailEntries.map(e => ({ type: e.email_type, scheduled_for: e.scheduled_for })),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
