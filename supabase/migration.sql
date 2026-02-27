-- KO Portfolio — Persistent Chat & Project Brief Schema
-- Run this in the Supabase SQL Editor after creating a project.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Visitor sessions (one per browser, keyed by localStorage UUID)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat message history
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_session_created ON messages(session_id, created_at ASC);

-- Structured project briefs extracted by AI from conversations
CREATE TABLE project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE UNIQUE,
  summary TEXT,
  goals JSONB NOT NULL DEFAULT '[]',
  features JSONB NOT NULL DEFAULT '[]',
  target_audience TEXT,
  tech_preferences TEXT,
  timeline TEXT,
  budget_signals TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'exploring'
    CHECK (status IN ('exploring', 'defining', 'scoped', 'shared')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: service-role key has full access (our API routes use it)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "service_role_messages" ON messages FOR ALL USING (true);
CREATE POLICY "service_role_briefs"   ON project_briefs FOR ALL USING (true);
