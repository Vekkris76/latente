-- LATENTE - Esquema SQL Mínimo (Fase 2)
-- Regla: Solo campos existentes en el dominio, normalización A < B, constraints de estado.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    profile_photo TEXT,
    observation_active BOOLEAN NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT check_account_status CHECK (account_status IN ('active', 'active_paused', 'suspended', 'deleted'))
);

-- 2. Consent States
CREATE TABLE consent_states (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    pattern_detection_consent BOOLEAN NOT NULL,
    location_abstraction_acknowledgment BOOLEAN NOT NULL,
    sync_window_proposals_consent BOOLEAN NOT NULL,
    terms_accepted BOOLEAN NOT NULL,
    privacy_policy_accepted BOOLEAN NOT NULL,
    consent_timestamp TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT check_consent_status CHECK (status IN ('all_granted', 'partial', 'revoked'))
);

-- 3. Abstract Events
CREATE TABLE abstract_events (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    time_bucket VARCHAR(20) NOT NULL,
    place_category VARCHAR(20) NOT NULL,
    day_type VARCHAR(20) NOT NULL,
    duration_bucket VARCHAR(20) NOT NULL,
    week_id VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT check_event_status CHECK (status IN ('pending', 'processed', 'expired'))
);
CREATE INDEX idx_events_user_status ON abstract_events(user_id, status);

-- 4. Patterns
CREATE TABLE patterns (
    pattern_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_category VARCHAR(20) NOT NULL,
    time_bucket VARCHAR(20) NOT NULL,
    day_type VARCHAR(20) NOT NULL,
    occurrences_count INTEGER NOT NULL,
    first_week_id VARCHAR(10) NOT NULL,
    last_week_id VARCHAR(10) NOT NULL,
    pattern_status VARCHAR(20) NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT check_pattern_status CHECK (pattern_status IN ('active', 'expired', 'matched'))
);

-- 5. Latent Co-Presences
CREATE TABLE latent_copresences (
    copresence_id UUID PRIMARY KEY,
    user_a_id UUID NOT NULL REFERENCES users(user_id),
    user_b_id UUID NOT NULL REFERENCES users(user_id),
    pattern_id_a UUID NOT NULL REFERENCES patterns(pattern_id),
    pattern_id_b UUID NOT NULL REFERENCES patterns(pattern_id),
    shared_place_category VARCHAR(20) NOT NULL,
    shared_time_bucket VARCHAR(20) NOT NULL,
    overlap_week_ids TEXT[] NOT NULL,
    status VARCHAR(20) NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_order_check CHECK (user_a_id < user_b_id),
    CONSTRAINT unique_copresence_pair UNIQUE (user_a_id, user_b_id, shared_place_category, shared_time_bucket),
    CONSTRAINT check_copresence_status CHECK (status IN ('detected', 'proposed', 'accepted', 'expired', 'declined', 'recognized_mutual', 'recognized_partial', 'no_recognition'))
);

-- 6. Sync Windows (WindowProposal)
CREATE TABLE sync_windows (
    window_id UUID PRIMARY KEY,
    copresence_id UUID REFERENCES latent_copresences(copresence_id),
    user_a_id UUID NOT NULL REFERENCES users(user_id),
    user_b_id UUID NOT NULL REFERENCES users(user_id),
    place_category VARCHAR(20) NOT NULL,
    time_bucket VARCHAR(20) NOT NULL,
    day_type VARCHAR(20) NOT NULL,
    proposed_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    window_status VARCHAR(30) NOT NULL,
    accept_a BOOLEAN NOT NULL DEFAULT FALSE,
    accept_b BOOLEAN NOT NULL DEFAULT FALSE,
    declined_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,
    CONSTRAINT user_order_window_check CHECK (user_a_id < user_b_id),
    CONSTRAINT check_window_status CHECK (window_status IN ('pending', 'accepted_by_a', 'accepted_by_b', 'activated', 'declined', 'expired'))
);

-- 7. Active Windows
CREATE TABLE active_windows (
    id UUID PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES sync_windows(window_id),
    user_a_id UUID NOT NULL REFERENCES users(user_id),
    user_b_id UUID NOT NULL REFERENCES users(user_id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_order_active_check CHECK (user_a_id < user_b_id),
    CONSTRAINT check_active_status CHECK (status IN ('active', 'completed'))
);

-- 8. Recognitions
CREATE TABLE recognitions (
    id UUID PRIMARY KEY,
    active_window_id UUID NOT NULL REFERENCES active_windows(id),
    user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT unique_recognition_user_window UNIQUE (active_window_id, user_id),
    CONSTRAINT check_recognition_status CHECK (status IN ('confirmed'))
);

-- 9. Revelations
CREATE TABLE revelations (
    id UUID PRIMARY KEY,
    active_window_id UUID NOT NULL REFERENCES active_windows(id),
    user_a_id UUID NOT NULL REFERENCES users(user_id),
    user_b_id UUID NOT NULL REFERENCES users(user_id),
    pattern_summary TEXT NOT NULL,
    revealed_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT user_order_revelation_check CHECK (user_a_id < user_b_id),
    CONSTRAINT check_revelation_status CHECK (status IN ('active', 'expired'))
);

-- 10. Conversation Messages
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY,
    revelation_id UUID NOT NULL REFERENCES revelations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(user_id),
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL
);

-- 11. Blocks
CREATE TABLE blocks (
    id UUID PRIMARY KEY,
    blocker_user_id UUID NOT NULL REFERENCES users(user_id),
    blocked_user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT no_self_block CHECK (blocker_user_id <> blocked_user_id),
    CONSTRAINT unique_block UNIQUE (blocker_user_id, blocked_user_id)
);

-- 12. Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY,
    reporter_user_id UUID NOT NULL REFERENCES users(user_id),
    reported_user_id UUID NOT NULL REFERENCES users(user_id),
    reason VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT no_self_report CHECK (reporter_user_id <> reported_user_id)
);

-- 13. User Credentials (Auth)
-- Justificación: Necesaria para el flujo de request-code/verify-code vía email.
-- Se mantiene separada de 'users' para facilitar la exclusión de PII en consultas generales.
CREATE TABLE user_credentials (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    verification_code_hash TEXT,
    code_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_credentials_email ON user_credentials(email);

-- 14. Auth Sessions
CREATE TABLE auth_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id);

-- 15. Idempotency Records
CREATE TABLE idempotency_records (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    idempotency_key VARCHAR(255) NOT NULL,
    status_code INTEGER NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, idempotency_key)
);
