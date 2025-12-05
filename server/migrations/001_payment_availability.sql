-- Supabase Migration Script for Payment & Availability Features
-- Run this in the Supabase SQL Editor

-- =====================================================
-- 1. Update Bookings table with new payment columns
-- =====================================================

-- Add payment amount columns
ALTER TABLE "Bookings" 
ADD COLUMN IF NOT EXISTS "totalAmount" FLOAT,
ADD COLUMN IF NOT EXISTS "advanceAmount" FLOAT,
ADD COLUMN IF NOT EXISTS "advancePaid" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "remainingAmount" FLOAT,
ADD COLUMN IF NOT EXISTS "advancePaymentId" VARCHAR(255);

-- Add refund columns
ALTER TABLE "Bookings"
ADD COLUMN IF NOT EXISTS "refundAmount" FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS "refundId" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT;

-- Update status enum to include 'cancelled'
-- First, we need to check and update the enum
DO $$ 
BEGIN
    BEGIN
        ALTER TYPE "enum_Bookings_status" ADD VALUE 'cancelled';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

-- Update paymentStatus enum
DO $$ 
BEGIN
    BEGIN
        ALTER TYPE "enum_Bookings_paymentStatus" ADD VALUE 'advance_paid';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    BEGIN
        ALTER TYPE "enum_Bookings_paymentStatus" ADD VALUE 'refunded';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

-- Add refundStatus enum column (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Bookings_refundStatus') THEN
        CREATE TYPE "enum_Bookings_refundStatus" AS ENUM ('none', 'pending', 'full', 'partial', 'processed');
    END IF;
END $$;

ALTER TABLE "Bookings" 
ADD COLUMN IF NOT EXISTS "refundStatus" "enum_Bookings_refundStatus" DEFAULT 'none';

-- =====================================================
-- 2. Update Ceremonies table with basePrice
-- =====================================================

ALTER TABLE "Ceremonies"
ADD COLUMN IF NOT EXISTS "basePrice" FLOAT DEFAULT 2500;

-- Update existing ceremonies with default prices
UPDATE "Ceremonies" SET "basePrice" = 2500 WHERE "slug" = 'satyanarayan' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 5000 WHERE "slug" = 'grihapravesh' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 2000 WHERE "slug" = 'naamkaranam' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 1500 WHERE "slug" = 'ganapathi-puja' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 7500 WHERE "slug" = 'upanayanam' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 3500 WHERE "slug" = 'bhumi-puja' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 5500 WHERE "slug" = 'navagraha-shanti' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 15000 WHERE "slug" = 'vivah-puja' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 4500 WHERE "slug" = 'dosha-nivaran' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 8000 WHERE "slug" = 'sashtiapthapoorthi' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 1500 WHERE "slug" = 'vahana-puja' AND "basePrice" IS NULL;
UPDATE "Ceremonies" SET "basePrice" = 3000 WHERE "slug" = 'business-opening' AND "basePrice" IS NULL;

-- =====================================================
-- 3. Create PanditAvailability table
-- =====================================================

-- Create slot type enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_PanditAvailabilities_slotType') THEN
        CREATE TYPE "enum_PanditAvailabilities_slotType" AS ENUM ('available', 'booked', 'blocked');
    END IF;
END $$;

-- Create the table
CREATE TABLE IF NOT EXISTS "PanditAvailabilities" (
    "id" SERIAL PRIMARY KEY,
    "PanditId" INTEGER REFERENCES "Pandits"(id) ON DELETE CASCADE,
    "BookingId" INTEGER REFERENCES "Bookings"(id) ON DELETE SET NULL,
    "date" DATE NOT NULL,
    "startTime" VARCHAR(10) NOT NULL DEFAULT '09:00',
    "endTime" VARCHAR(10) NOT NULL DEFAULT '18:00',
    "isAvailable" BOOLEAN DEFAULT TRUE,
    "slotType" "enum_PanditAvailabilities_slotType" DEFAULT 'available',
    "notes" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "idx_pandit_availability_date" ON "PanditAvailabilities"("date");
CREATE INDEX IF NOT EXISTS "idx_pandit_availability_pandit" ON "PanditAvailabilities"("PanditId");
CREATE INDEX IF NOT EXISTS "idx_pandit_availability_booking" ON "PanditAvailabilities"("BookingId");

-- =====================================================
-- 4. Migrate existing booking amounts
-- =====================================================

-- For existing bookings, set totalAmount from amount if not already set
UPDATE "Bookings" 
SET "totalAmount" = "amount",
    "advanceAmount" = "amount" * 0.25,
    "remainingAmount" = "amount" * 0.75
WHERE "totalAmount" IS NULL AND "amount" IS NOT NULL AND "amount" > 0;

-- Mark paid bookings as having advance paid
UPDATE "Bookings"
SET "advancePaid" = TRUE
WHERE "paymentStatus" = 'paid' AND "advancePaid" = FALSE;

-- =====================================================
-- Verification queries (run to check migration)
-- =====================================================

-- Check Bookings columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Bookings';

-- Check Ceremonies has basePrice
-- SELECT id, title, "basePrice" FROM "Ceremonies";

-- Check PanditAvailabilities table exists
-- SELECT * FROM "PanditAvailabilities" LIMIT 1;

COMMIT;
