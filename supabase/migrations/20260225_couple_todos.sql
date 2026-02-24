-- Table couple_todos
CREATE TABLE IF NOT EXISTS public.couple_todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_couple_todos_user_id ON public.couple_todos(user_id);

ALTER TABLE public.couple_todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own todos"
    ON public.couple_todos FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
    ON public.couple_todos FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
    ON public.couple_todos FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
    ON public.couple_todos FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
