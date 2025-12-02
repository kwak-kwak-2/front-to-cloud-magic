-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cafe applications table
CREATE TABLE public.cafe_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  cafe_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  business_hours TEXT,
  customer_issues TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analysis results table
CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.cafe_applications(id) ON DELETE CASCADE,
  peak_hour TEXT,
  long_stay_rate NUMERIC,
  customer_flow JSONB,
  recommendations JSONB,
  video_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create uploaded files tracking table
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.cafe_applications(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cafe_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no auth required for this demo)
CREATE POLICY "Anyone can insert applications" ON public.cafe_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view applications" ON public.cafe_applications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert analysis" ON public.analysis_results
  FOR ALL USING (true);

CREATE POLICY "Anyone can view files" ON public.uploaded_files
  FOR ALL USING (true);

-- Create storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cafe-data', 'cafe-data', false);

-- Storage policies for file uploads
CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cafe-data');

CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'cafe-data');