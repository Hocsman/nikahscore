-- Migration pour tables Budget Sessions et Todo List
-- À exécuter dans le SQL Editor de Supabase

-- Table: budget_sessions
CREATE TABLE IF NOT EXISTS public.budget_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_budget_sessions_user_id ON public.budget_sessions(user_id);
CREATE INDEX idx_budget_sessions_scheduled_at ON public.budget_sessions(scheduled_at);

-- RLS (Row Level Security)
ALTER TABLE public.budget_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget sessions" 
  ON public.budget_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget sessions" 
  ON public.budget_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget sessions" 
  ON public.budget_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget sessions" 
  ON public.budget_sessions FOR DELETE 
  USING (auth.uid() = user_id);


-- Table: couple_todos
CREATE TABLE IF NOT EXISTS public.couple_todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_couple_todos_user_id ON public.couple_todos(user_id);
CREATE INDEX idx_couple_todos_completed ON public.couple_todos(completed);

-- RLS (Row Level Security)
ALTER TABLE public.couple_todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own todos" 
  ON public.couple_todos FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
  ON public.couple_todos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
  ON public.couple_todos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
  ON public.couple_todos FOR DELETE 
  USING (auth.uid() = user_id);


-- Function pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_budget_sessions_updated_at 
  BEFORE UPDATE ON public.budget_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couple_todos_updated_at 
  BEFORE UPDATE ON public.couple_todos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
