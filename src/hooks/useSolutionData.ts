import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisData {
  peak_hour: string | null;
  long_stay_rate: number | null;
  video_analysis: Record<string, unknown> | null;
}

interface CafeData {
  cafe_name: string;
}

export const useSolutionData = (applicationId: string | undefined) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [cafeData, setCafeData] = useState<CafeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      const [analysisResult, cafeResult] = await Promise.all([
        supabase
          .from("analysis_results")
          .select("*")
          .eq("application_id", applicationId)
          .single(),
        supabase
          .from("cafe_applications")
          .select("*")
          .eq("id", applicationId)
          .single(),
      ]);

      if (analysisResult.data) {
        setAnalysisData({
          peak_hour: analysisResult.data.peak_hour,
          long_stay_rate: analysisResult.data.long_stay_rate,
          video_analysis: analysisResult.data.video_analysis as Record<string, unknown> | null,
        });
      }
      setCafeData(cafeResult.data);
      setLoading(false);
    };

    fetchData();
  }, [applicationId]);

  return { analysisData, cafeData, loading };
};
