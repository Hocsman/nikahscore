-- ============================================================
-- Migration: Tables Coach AI (coach_conversations + coach_messages)
-- ============================================================

-- Table des conversations
CREATE TABLE IF NOT EXISTS public.coach_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Nouvelle conversation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_id ON public.coach_conversations(user_id);

-- Table des messages
CREATE TABLE IF NOT EXISTS public.coach_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.coach_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coach_messages_conversation_id ON public.coach_messages(conversation_id);

-- RLS
ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

-- Policies conversations : un utilisateur ne voit que ses propres conversations
CREATE POLICY "Users can read own conversations"
    ON public.coach_conversations FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own conversations"
    ON public.coach_conversations FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
    ON public.coach_conversations FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
    ON public.coach_conversations FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Policies messages : accès via la conversation (qui est déjà filtrée par user_id)
CREATE POLICY "Users can read messages of own conversations"
    ON public.coach_messages FOR SELECT
    TO authenticated
    USING (
        conversation_id IN (
            SELECT id FROM public.coach_conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in own conversations"
    ON public.coach_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        conversation_id IN (
            SELECT id FROM public.coach_conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages of own conversations"
    ON public.coach_messages FOR DELETE
    TO authenticated
    USING (
        conversation_id IN (
            SELECT id FROM public.coach_conversations WHERE user_id = auth.uid()
        )
    );
