-- Supabase Security Migration - Enable Row Level Security
-- Run this in the Supabase SQL Editor

-- =====================================================
-- 1. Enable RLS on all tables
-- =====================================================

ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pandits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ceremonies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageContents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PanditAvailabilities" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Ceremonies - Public read, admin write
-- =====================================================

CREATE POLICY "Ceremonies are viewable by everyone"
ON "Ceremonies" FOR SELECT
USING (true);

CREATE POLICY "Ceremonies are editable by service role only"
ON "Ceremonies" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 3. PageContents - Public read, admin write
-- =====================================================

CREATE POLICY "PageContents are viewable by everyone"
ON "PageContents" FOR SELECT
USING (true);

CREATE POLICY "PageContents are editable by service role only"
ON "PageContents" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 4. Users - Users can view/edit own data
-- =====================================================

-- Allow service role full access (for API)
CREATE POLICY "Service role has full access to Users"
ON "Users" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 5. Pandits - Service role access
-- =====================================================

CREATE POLICY "Service role has full access to Pandits"
ON "Pandits" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 6. Bookings - Service role access
-- =====================================================

CREATE POLICY "Service role has full access to Bookings"
ON "Bookings" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- 7. PanditAvailabilities - Service role access
-- =====================================================

CREATE POLICY "Service role has full access to PanditAvailabilities"
ON "PanditAvailabilities" FOR ALL
USING (auth.role() = 'service_role');

-- =====================================================
-- IMPORTANT: Your backend uses service_role key
-- =====================================================
-- Since your Node.js backend authenticates via JWT and uses 
-- Sequelize with the service_role connection, these policies
-- allow your API full access while blocking direct DB access.
--
-- Make sure your .env has:
-- DATABASE_URL=postgresql://postgres:[SERVICE_ROLE_KEY]@...
-- =====================================================
