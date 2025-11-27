-- Migration: Add clinic_id to services table
-- This makes services per-clinic instead of global

-- Add clinic_id column (nullable for backward compatibility with existing data)
ALTER TABLE vet_services 
ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

-- Add is_active column for soft deletes
ALTER TABLE vet_services 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_clinic ON vet_services(clinic_id);

-- Optional: Update existing services to be global (NULL clinic_id means available to all clinics)
-- Or you can assign them to a specific clinic
-- UPDATE vet_services SET clinic_id = NULL WHERE clinic_id IS NULL;

COMMENT ON COLUMN vet_services.clinic_id IS 'NULL means service is global/template, otherwise specific to clinic';
COMMENT ON COLUMN vet_services.is_active IS 'Soft delete flag - false means service is inactive/deleted';
