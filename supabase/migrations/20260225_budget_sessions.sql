-- Table budget_sessions
CREATE TABLE IF NOT EXISTS public.budget_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_budget_sessions_user_id ON public.budget_sessions(user_id);

-- RLS
ALTER TABLE public.budget_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own budget sessions"
    ON public.budget_sessions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget sessions"
    ON public.budget_sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget sessions"
    ON public.budget_sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget sessions"
    ON public.budget_sessions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
