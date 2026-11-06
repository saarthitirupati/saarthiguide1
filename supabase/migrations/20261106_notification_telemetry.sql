-- Supabase Migration: Create notification_telemetry table for live delivery receipts
CREATE TABLE IF NOT EXISTS public.notification_telemetry (
    tag TEXT NOT NULL,
    device_id TEXT NOT NULL,
    app_version TEXT DEFAULT 'unknown',
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tag, device_id)
);

ALTER TABLE public.notification_telemetry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert notification_telemetry" ON public.notification_telemetry;
CREATE POLICY "Allow anon insert notification_telemetry"
ON public.notification_telemetry FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select notification_telemetry" ON public.notification_telemetry;
CREATE POLICY "Allow anon select notification_telemetry"
ON public.notification_telemetry FOR SELECT
USING (true);
