-- Hotels table for Visitors Guide
-- Admin can add/edit/delete hotels that appear on the visitors guide page

CREATE TABLE IF NOT EXISTS hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rate TEXT NOT NULL,
  phone TEXT NOT NULL,
  rating INTEGER DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Anyone can read hotels (public page)
CREATE POLICY "hotels_select_public" ON hotels
  FOR SELECT USING (true);

-- Only admins can insert/update/delete hotels
CREATE POLICY "hotels_insert_admin" ON hotels
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "hotels_update_admin" ON hotels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "hotels_delete_admin" ON hotels
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels(created_at DESC);
