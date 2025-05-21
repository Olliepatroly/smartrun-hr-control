
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const openAIApiKey = Deno.env.get('Analysis_metrics') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, currentHR, targetZoneMin, targetZoneMax, currentSpeed, maxSpeed, minSpeed } = await req.json();

    // First get user's health metrics from database
    const { data: healthMetrics, error: healthError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (healthError) {
      console.error('Error fetching health metrics:', healthError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch health metrics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the prompt for OpenAI
    let prompt = `As a smart workout assistant, analyze this data and recommend a treadmill speed adjustment.
User health profile:
- Max heart rate: ${healthMetrics?.max_heart_rate || 'Not provided'}
- Resting heart rate: ${healthMetrics?.resting_heart_rate || 'Not provided'}
- VO2max: ${healthMetrics?.vo2max || 'Not provided'}
- Cardiac disability: ${healthMetrics?.cardiac_disability || 'None'}

Current workout state:
- Current heart rate: ${currentHR} BPM
- Target heart rate zone: ${targetZoneMin}-${targetZoneMax} BPM
- Current speed: ${currentSpeed} km/h
- Min allowed speed: ${minSpeed} km/h
- Max allowed speed: ${maxSpeed} km/h

Based on this data, should the treadmill speed be increased, decreased, or maintained? By how much (in km/h)? Return ONLY a JSON object with 'action' (increase/decrease/maintain) and 'amount' (in km/h).`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fitness AI that helps control treadmill speeds based on heart rate data. You only return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error calling AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await openAIResponse.json();
    const recommendation = aiData.choices[0].message.content;
    
    // Parse the recommendation (expecting JSON)
    let parsedRecommendation;
    try {
      // Remove any extra text and just get the JSON part
      const jsonMatch = recommendation.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : recommendation;
      parsedRecommendation = JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      parsedRecommendation = { 
        action: 'maintain', 
        amount: 0,
        error: 'Could not parse AI recommendation',
        raw: recommendation
      };
    }

    // Log the recommendation for debugging
    console.log('AI recommendation:', parsedRecommendation);

    // Return the recommendation to the client
    return new Response(
      JSON.stringify(parsedRecommendation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-metrics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
