-- ============================================================
-- SAARTHI HOTEL BOOKINGS & PILGRIM STAY REQUESTS MIGRATION
-- Run against Supabase PostgreSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id TEXT PRIMARY KEY,
  hotel_id TEXT NOT NULL DEFAULT 'vamana-inn-tirupati',
  hotel_name TEXT NOT NULL DEFAULT 'Hotel Vamana Inn, Tirupati',
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 2,
  rooms_count INTEGER NOT NULL DEFAULT 1,
  budget_per_night NUMERIC(10, 2) DEFAULT 2500,
  cab_preference TEXT DEFAULT 'yes',
  special_requirements TEXT,
  communication_language TEXT DEFAULT 'Telugu',
  total_amount NUMERIC(10, 2) DEFAULT 2500,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'confirmed', 'cancelled'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hotel_bookings ADD COLUMN IF NOT EXISTS communication_language TEXT DEFAULT 'Telugu';

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_created_at ON public.hotel_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_status ON public.hotel_bookings (status);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_phone ON public.hotel_bookings (guest_phone);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (pilgrims) can submit a stay request
CREATE POLICY "Allow public insert to hotel_bookings"
  ON public.hotel_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Authenticated admins/partners can view bookings
CREATE POLICY "Allow authenticated read hotel_bookings"
  ON public.hotel_bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Authenticated admins/partners can update booking status & notes
CREATE POLICY "Allow authenticated update hotel_bookings"
  ON public.hotel_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Enable Supabase Realtime broadcast for live admin updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'hotel_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hotel_bookings;
  END IF;
END $$;
