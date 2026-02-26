-- ============================================
-- Learn Swedish: Private Vocabulary & Security
-- ============================================

-- 1. Add user_id to vocabulary for ownership
ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Update Row Level Security on vocabulary
-- First, drop the overly permissive insert policy
DROP POLICY IF EXISTS "Users can insert new vocabulary" ON vocabulary;

-- Refine SELECT policy: Users see official words (user_id IS NULL) OR their own
DROP POLICY IF EXISTS "Vocabulary is readable by all authenticated users" ON vocabulary;
CREATE POLICY "Users can view official and their own vocabulary"
  ON vocabulary FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Refine INSERT policy: Users can only insert their own vocabulary
CREATE POLICY "Users can insert their own private vocabulary"
  ON vocabulary FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. Ensure uniqueness is scoped correctly
-- We want to allow the SAME Swedish word to exist multiple times IF they belong to DIFFERENT users,
-- but only ONCE in the official bank (user_id IS NULL).
-- First, remove the old unique constraint if it was just on 'swedish'
ALTER TABLE vocabulary DROP CONSTRAINT IF EXISTS vocabulary_swedish_key;

-- Create a unique index that handles NULL user_id for official words
-- and unique swedish per user for private words.
CREATE UNIQUE INDEX IF NOT EXISTS vocabulary_swedish_user_id_idx ON vocabulary (swedish, (COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid)));
