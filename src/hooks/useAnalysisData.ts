import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DailyFlow {
  date: string;
  hourlyData: { hour: string; customers: number }[];
}

interface DailyRevenue {
  date: string;
  revenue: number;
  customers: number;
}

interface AnalysisData {
  peak_hour: string;
  long_stay_rate: number;
  customer_flow: { hour: string; customers: number }[];
  recommendations: { title: string; description: string; expected_impact?: string }[];
  video_analysis: {
    avgStayTime?: string;
    laptopUsageRate?: string;
    stayDistribution?: { name: string; value: number }[];
    seatDistribution?: { name: string; value: number }[];
    dailyFlows?: DailyFlow[];
    dailyRevenues?: DailyRevenue[];
  };
}

export const useAnalysisData = (applicationId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      try {
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
          const { data, error } = await supabase
            .from("analysis_results")
            .select("*")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error) {
            console.error("Error fetching analysis:", error);
            break;
          }

          if (data) {
            setAnalysisData(data as unknown as AnalysisData);
            setLoading(false);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [applicationId]);

  return { loading, analysisData };
};
