-- Migration: Add Profile Features (Photos, Bio, Ratings, Auth Tokens)
-- Date: 2025-12-06
-- Description: Adds columns for profile management and verify/reset flow, and creates Reviews table.

-- 1. Update Users table
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "passwordResetToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP WITH TIME ZONE;

-- 2. Update Pandits table
ALTER TABLE "Pandits" 
ADD COLUMN IF NOT EXISTS "photo" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "languages" JSONB DEFAULT '["Hindi", "English"]',
ADD COLUMN IF NOT EXISTS "rating" FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalReviews" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "passwordResetToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP WITH TIME ZONE;

-- 3. Create Reviews table
CREATE TABLE IF NOT EXISTS "Reviews" (
    "id" SERIAL PRIMARY KEY,
    "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
    "comment" TEXT,
    "ceremonyType" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UserId" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL,
    "PanditId" INTEGER REFERENCES "Pandits"("id") ON DELETE CASCADE
);

-- 4. Enable RLS on Reviews table
ALTER TABLE "Reviews" ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Reviews
-- Allow anyone to read reviews
CREATE POLICY "Public reviews are viewable by everyone" 
ON "Reviews" FOR SELECT 
USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
ON "Reviews" FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow service_role full access (for backend)
CREATE POLICY "Service role has full access to reviews" 
ON "Reviews" FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
