import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId, posPath, cctvPath } = await req.json();
    
    console.log("Processing data for application:", applicationId);
    console.log("POS file path:", posPath);
    console.log("CCTV file path:", cctvPath);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate mock analysis data
    const peakHours = ["14:00-16:00", "10:00-12:00", "16:00-18:00"];
    const randomPeakHour = peakHours[Math.floor(Math.random() * peakHours.length)];
    const longStayRate = Math.floor(Math.random() * 30 + 40); // 40-70%

    const customerFlow = [
      { hour: "09:00", customers: Math.floor(Math.random() * 20 + 10) },
      { hour: "10:00", customers: Math.floor(Math.random() * 30 + 25) },
      { hour: "11:00", customers: Math.floor(Math.random() * 40 + 35) },
      { hour: "12:00", customers: Math.floor(Math.random() * 50 + 45) },
      { hour: "13:00", customers: Math.floor(Math.random() * 55 + 50) },
      { hour: "14:00", customers: Math.floor(Math.random() * 60 + 55) },
      { hour: "15:00", customers: Math.floor(Math.random() * 65 + 58) },
      { hour: "16:00", customers: Math.floor(Math.random() * 55 + 50) },
      { hour: "17:00", customers: Math.floor(Math.random() * 45 + 40) },
      { hour: "18:00", customers: Math.floor(Math.random() * 35 + 30) },
      { hour: "19:00", customers: Math.floor(Math.random() * 25 + 20) },
      { hour: "20:00", customers: Math.floor(Math.random() * 20 + 15) },
    ];

    const recommendations = [
      {
        title: "피크 시간대 시간제 운영 도입",
        description: `${randomPeakHour} 시간대에 최대 이용 시간을 2시간으로 제한하여 좌석 회전율을 높입니다. 사전 공지와 함께 점진적으로 시행하면 고객 불만을 최소화할 수 있습니다.`,
        expected_impact: "좌석 회전율 30% 증가 예상"
      },
      {
        title: "스터디 존 & 카페 존 분리 운영",
        description: "장시간 공부가 필요한 고객과 일반 카페 이용 고객의 공간을 분리하여 각 고객 니즈에 맞는 서비스를 제공합니다.",
        expected_impact: "고객 만족도 25% 향상 예상"
      },
      {
        title: "멤버십 프로그램 운영",
        description: "규정을 준수하는 단골 고객에게 포인트 적립 혜택을 제공하여 긍정적인 이용 문화를 조성합니다.",
        expected_impact: "재방문율 40% 증가 예상"
      }
    ];

    const videoAnalysis = {
      avgStayTime: "2시간 15분",
      seatUtilization: "85%",
      beverageOrderRate: "72%"
    };

    // Insert analysis results into database
    const { data, error } = await supabase
      .from("analysis_results")
      .insert({
        application_id: applicationId,
        peak_hour: randomPeakHour,
        long_stay_rate: longStayRate,
        customer_flow: customerFlow,
        recommendations: recommendations,
        video_analysis: videoAnalysis,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Analysis completed successfully:", data);

    return new Response(
      JSON.stringify({ success: true, analysisId: data.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing cafe data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
