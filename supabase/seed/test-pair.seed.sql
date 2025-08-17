-- Script pour créer une paire de test rapidement
-- Exécutez ceci dans votre console Supabase

INSERT INTO pairs (
    id,
    user_a_email, 
    user_b_email,
    user_a_hash,
    user_b_hash,
    invite_token,
    status,
    expires_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test-a@example.com',
    'test-b@example.com',
    encode('test-a@example.com', 'base64'),
    encode('test-b@example.com', 'base64'),
    'test-invite-token-123',
    'pending',
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW()
);

-- Récupérer l'ID de la paire créée pour les tests
SELECT id, user_a_email, invite_token 
FROM pairs 
WHERE user_a_email = 'test-a@example.com';
