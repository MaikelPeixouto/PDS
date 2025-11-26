

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(14),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    description TEXT,
    hours VARCHAR(255),
    specialties JSONB DEFAULT '[]'::jsonb,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_user_or_clinic CHECK (
        (user_id IS NOT NULL AND clinic_id IS NULL) OR
        (user_id IS NULL AND clinic_id IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS vet_pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age VARCHAR(50),
    weight VARCHAR(50),
    gender VARCHAR(10) CHECK (gender IN ('Macho', 'Fêmea')),
    microchip VARCHAR(50) UNIQUE,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'Saudável',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vet_pet_vaccines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES vet_pets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_vaccination_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vet_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vet_veterinarians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    crmv VARCHAR(50) UNIQUE NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vet_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES vet_pets(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    veterinarian_id UUID REFERENCES vet_veterinarians(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES vet_services(id) ON DELETE RESTRICT,
    appointment_date TIMESTAMP NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card', 'debit_card', 'cash', 'pix', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinic_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES vet_appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_clinic_appointment UNIQUE(user_id, clinic_id, appointment_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clinics_email ON clinics(email);
CREATE INDEX IF NOT EXISTS idx_clinics_cnpj ON clinics(cnpj);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_clinic_id ON refresh_tokens(clinic_id);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON vet_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_microchip ON vet_pets(microchip);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id ON vet_pet_vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_clinic_id ON vet_veterinarians(clinic_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_crmv ON vet_veterinarians(crmv);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON vet_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON vet_appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pet_id ON vet_appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON vet_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_veterinarian_id ON vet_appointments(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_id ON clinic_reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON clinic_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_appointment_id ON clinic_reviews(appointment_id);

INSERT INTO vet_services (name, description, price, duration_minutes) VALUES
    ('Consulta Geral', 'Consulta veterinária geral para avaliação de saúde', 150.00, 30),
    ('Vacinação', 'Aplicação de vacinas', 80.00, 15),
    ('Cirurgia de Castração', 'Procedimento cirúrgico de castração', 600.00, 120),
    ('Check-up Completo', 'Exame completo de saúde', 250.00, 45),
    ('Emergência', 'Atendimento de emergência 24h', 300.00, 60)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS clinic_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_clinic_id ON clinic_notifications(clinic_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON clinic_notifications(clinic_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON clinic_notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS clinic_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL UNIQUE REFERENCES clinics(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    push_enabled BOOLEAN DEFAULT true,
    appointments_enabled BOOLEAN DEFAULT true,
    payments_enabled BOOLEAN DEFAULT true,
    reminders_enabled BOOLEAN DEFAULT true,
    marketing_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
