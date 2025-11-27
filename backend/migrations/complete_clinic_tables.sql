-- =============================================
-- VetLink Complete Database Migration
-- =============================================
-- Creates all missing tables for clinic settings
-- Run this before starting the backend server
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CLINIC OPERATING HOURS
-- =============================================
CREATE TABLE IF NOT EXISTS clinic_operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    open_time TIME,
    close_time TIME,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_operating_hours_clinic 
ON clinic_operating_hours(clinic_id);

-- =============================================
-- 2. CLINIC APPOINTMENT DURATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS clinic_appointment_durations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID UNIQUE NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    standard INTEGER DEFAULT 30,
    followup INTEGER DEFAULT 15,
    emergency INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointment_durations_clinic 
ON clinic_appointment_durations(clinic_id);

-- =============================================
-- 3. CLINIC PAYMENT METHODS
-- =============================================
CREATE TABLE IF NOT EXISTS clinic_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_methods_clinic 
ON clinic_payment_methods(clinic_id);

-- =============================================
-- 4. CLINIC BILLING INFO
-- =============================================
CREATE TABLE IF NOT EXISTS clinic_billing_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID UNIQUE NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    pix_key VARCHAR(255),
    bank_name VARCHAR(255),
    bank_agency VARCHAR(50),
    bank_account VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_billing_info_clinic 
ON clinic_billing_info(clinic_id);

-- =============================================
-- 5. UPDATE VET_SERVICES TABLE
-- Add clinic_id and is_active columns if they don't exist
-- =============================================
DO $$ 
BEGIN
    -- Add clinic_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vet_services' AND column_name = 'clinic_id'
    ) THEN
        ALTER TABLE vet_services 
        ADD COLUMN clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;
        
        CREATE INDEX idx_services_clinic ON vet_services(clinic_id);
    END IF;

    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vet_services' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE vet_services 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- =============================================
-- DONE!
-- =============================================
-- All tables created successfully
-- Backend should now start without crashing
-- =============================================
