import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("[send-beta-email] Edge function loaded");

// Email templates
const getEmailTemplate = (emailType: string, fullName: string, appUrl: string): { subject: string; html: string } => {
  const name = fullName || "Beta Tester";
  const unsubscribeUrl = `${appUrl}/unsubscribe`;
  
  const templates: Record<string, { subject: string; html: string }> = {
    welcome: {
      subject: "Welcome to My Headache Experience Journal Beta!",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1; margin: 0;">🎉 Welcome to the Beta!</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>Welcome to the <strong>My Headache Experience Journal</strong> beta program! You're now part of an exclusive group helping us build a better way to understand and manage headaches.</p>
  
  <h3 style="color: #6366f1;">What you can do now:</h3>
  <ul>
    <li>📍 Log headaches using our visual pain location mapper</li>
    <li>🔍 Track triggers like food, stress, and weather</li>
    <li>📊 Discover patterns in your headache data</li>
    <li>⌚ Connect health trackers (Fitbit, Oura)</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log Your First Headache</a>
  </div>
  
  <p>Your feedback directly shapes the future of this app. We can't wait to hear what you think!</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    getting_started: {
      subject: "Quick Start: Log Your First Headache in 2 Minutes",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">📝 Quick Start Guide</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>Ready to start tracking? Here's how to log your first headache in just 2 minutes:</p>
  
  <h3 style="color: #6366f1;">3 Simple Steps:</h3>
  <ol>
    <li><strong>Tap "Log Headache"</strong> - Start a new entry anytime</li>
    <li><strong>Select pain location</strong> - Use our visual head map to pinpoint exactly where it hurts</li>
    <li><strong>Add details</strong> - Record intensity, triggers, and treatments</li>
  </ol>
  
  <div style="background-color: #f0f0ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>💡 Pro tip:</strong> The more consistently you track, the better patterns you'll discover!</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/log-headache" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Tracking Now</a>
  </div>
  
  <p>Questions? Just reply to this email!</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    feature_discovery: {
      subject: "Discover: Visual Pain Mapping and Trigger Tracking",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">🗺️ Feature Spotlight</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>You've been using the app for a week now! Let's dive deeper into some powerful features:</p>
  
  <h3 style="color: #6366f1;">📍 Visual Pain Location Mapping</h3>
  <p>Our 3D head model lets you pinpoint exactly where pain occurs - front, back, sides, or specific areas. This precision helps identify patterns your doctor will find valuable.</p>
  
  <h3 style="color: #6366f1;">🔍 Trigger Tracking</h3>
  <p>Track potential triggers like:</p>
  <ul>
    <li>🍕 Food and beverages</li>
    <li>😰 Stress levels</li>
    <li>🌤️ Weather changes</li>
    <li>😴 Sleep quality</li>
  </ul>
  
  <h3 style="color: #6366f1;">⌚ Health Tracker Integration</h3>
  <p>Connect your Fitbit or Oura ring to automatically import sleep data and correlate it with your headaches.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/profile" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Explore Features</a>
  </div>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    engagement_nudge: {
      subject: "How's Your Tracking Going? We're Here to Help",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">👋 Quick Check-In</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>You're 2 weeks into the beta - how's everything going?</p>
  
  <p>We wanted to check in and make sure you're getting the most out of the app. If you've been tracking regularly, you might already be seeing some patterns emerge!</p>
  
  <h3 style="color: #6366f1;">Having trouble?</h3>
  <p>Here are some common questions:</p>
  <ul>
    <li><strong>Not sure what to track?</strong> Start with just pain location and intensity</li>
    <li><strong>Forgot to log?</strong> You can always add past headaches</li>
    <li><strong>Need help?</strong> Visit our support page or reply to this email</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/log-headache" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">Log a Headache</a>
    <a href="${appUrl}/support" style="background-color: #f0f0ff; color: #6366f1; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get Help</a>
  </div>
  
  <p>Your experience matters to us!</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    mid_point_feedback: {
      subject: "You're Halfway There - Share Your Thoughts",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">🎯 4 Weeks Complete!</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>Congratulations! You're halfway through the beta program. 🎉</p>
  
  <p>Your participation has been invaluable. Now we'd love to hear your thoughts on how things are going.</p>
  
  <h3 style="color: #6366f1;">We'd love to know:</h3>
  <ul>
    <li>What features do you use most?</li>
    <li>What's working well for you?</li>
    <li>What would make the app better?</li>
    <li>Any bugs or issues you've encountered?</li>
  </ul>
  
  <div style="background-color: #f0f0ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Your feedback directly influences what we build next!</strong></p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/support" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Share Feedback</a>
  </div>
  
  <p>Thank you for being part of this journey!</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    power_user_tips: {
      subject: "Pro Tips: Get More Insights From Your Data",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">💪 Power User Tips</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>You've been with us for 6 weeks now! Here are some advanced tips to get even more value from your tracking:</p>
  
  <h3 style="color: #6366f1;">📊 Analysis Dashboard</h3>
  <p>Check your Analysis page to see patterns over time, including frequency trends, common triggers, and treatment effectiveness.</p>
  
  <h3 style="color: #6366f1;">🔗 Correlations</h3>
  <p>The app looks for connections between your headaches and factors like sleep, weather, and menstrual cycle (if tracking).</p>
  
  <h3 style="color: #6366f1;">📤 Export Your Data</h3>
  <p>Generate PDF reports to share with your healthcare provider. They'll appreciate the detailed, organized information!</p>
  
  <h3 style="color: #6366f1;">⚙️ Custom Variables</h3>
  <p>Track additional factors unique to you - create custom variables in settings.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/analysis" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Your Insights</a>
  </div>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    beta_ending_soon: {
      subject: "Beta Ending Soon - One Week Left!",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">⏰ One Week Left!</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>The beta testing period is coming to an end in just <strong>one week</strong>!</p>
  
  <p>Before we wrap up, we'd love for you to:</p>
  
  <h3 style="color: #6366f1;">Final Week Checklist:</h3>
  <ul>
    <li>✅ Try any features you haven't explored yet</li>
    <li>✅ Note any bugs or issues you've encountered</li>
    <li>✅ Think about your overall experience</li>
    <li>✅ Prepare your final feedback</li>
  </ul>
  
  <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>🔜 What's next?</strong> After the beta, we'll be launching on the App Store and Google Play! Your data will be preserved.</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Your Testing</a>
  </div>
  
  <p>Thank you for being an amazing beta tester!</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    },
    
    final_feedback: {
      subject: "Thank You! Your Final Feedback Matters",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366f1;">🙏 Thank You!</h1>
  </div>
  
  <p>Hi ${name},</p>
  
  <p>The 8-week beta period has officially concluded. <strong>Thank you so much</strong> for being part of this journey!</p>
  
  <p>Your participation has been invaluable in shaping the future of My Headache Experience Journal. Every headache you logged, every bug you reported, and every piece of feedback you shared has made the app better.</p>
  
  <h3 style="color: #6366f1;">One Final Request</h3>
  <p>We'd be incredibly grateful if you could share your final thoughts:</p>
  <ul>
    <li>What was your overall experience?</li>
    <li>Would you recommend the app to others with headaches?</li>
    <li>What's the #1 thing we should improve?</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/support" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Submit Final Feedback</a>
  </div>
  
  <div style="background-color: #f0f0ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>What's next?</strong> We're preparing for our App Store and Google Play launch. As a beta tester, you'll be the first to know when we go live!</p>
  </div>
  
  <p>From the bottom of our hearts, thank you! 💜</p>
  
  <p>Best regards,<br>The Headache Experience Journal Team</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from beta emails</a>
  </p>
</body>
</html>`
    }
  };
  
  return templates[emailType] || templates.welcome;
};

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.log(`[${requestId}] send-beta-email invoked`);

  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error(`[${requestId}] RESEND_API_KEY not configured`);
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const { queue_id, email, email_type, full_name } = await req.json();
    
    console.log(`[${requestId}] Processing email - queue_id: ${queue_id}, type: ${email_type}`);

    // Get the app URL from environment or use default
    const appUrl = Deno.env.get("APP_URL") || "https://headacherecovery.org";
    
    // Get email template
    const template = getEmailTemplate(email_type, full_name || "Beta Tester", appUrl);
    
    console.log(`[${requestId}] Sending email to: ${email}, subject: ${template.subject}`);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Headache Experience Journal <noreply@headacherecovery.org>",
      to: [email],
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error(`[${requestId}] Resend error:`, error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${requestId}] Email sent successfully:`, data);

    // If queue_id provided, update the queue status
    if (queue_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      const { error: updateError } = await supabase
        .from("beta_email_queue")
        .update({ 
          status: "sent", 
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", queue_id);

      if (updateError) {
        console.error(`[${requestId}] Failed to update queue status:`, updateError);
      } else {
        console.log(`[${requestId}] Queue status updated to sent`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message_id: data?.id }),
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
