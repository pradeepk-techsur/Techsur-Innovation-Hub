-- Migration 002: Users table for session and audit attribution
-- NOTE: In production, this table will be populated from the external identity provider
-- (Azure Entra ID Government or Judiciary SSO). For MVP dev, rows are seeded manually.

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id   VARCHAR(500) UNIQUE,           -- OIDC subject / SSO user ID
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(254) NOT NULL UNIQUE,
  office        VARCHAR(200) NOT NULL DEFAULT '',
  role          VARCHAR(32) NOT NULL DEFAULT 'stakeholder'
                  CHECK (role IN ('stakeholder', 'curator', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_users_email       ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_external_id ON users(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role        ON users(role);

-- Dev seed users (only inserted in development; production users come from identity provider)
-- Using ON CONFLICT DO NOTHING so re-runs are safe
INSERT INTO users (id, name, email, office, role) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Dev Stakeholder', 'stake@dev.local', 'Test Office', 'stakeholder'),
  ('00000000-0000-0000-0000-000000000011', 'Dev Curator', 'curator@dev.local', 'TSIO Innovation & Research', 'curator'),
  ('00000000-0000-0000-0000-000000000012', 'Dev Admin', 'admin@dev.local', 'TSIO Innovation & Research', 'admin')
ON CONFLICT (email) DO NOTHING;
