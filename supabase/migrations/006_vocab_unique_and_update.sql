-- Fix for Smart Flashcards 'database error'

-- 1. Remove any accidental duplicates that were created before we added the unique constraint.
-- This keeps the oldest occurrence of each Swedish word and deletes the rest.
DELETE FROM vocabulary
WHERE id NOT IN (
    SELECT MIN(id)
    FROM vocabulary
    GROUP BY swedish
);

-- 2. Add UNIQUE constraint to the swedish column so UPSERT (ON CONFLICT) knows what to check against
ALTER TABLE vocabulary ADD CONSTRAINT vocabulary_swedish_key UNIQUE (swedish);

-- 3. Allow authenticated users to update existing vocabulary so they don't get blocked by RLS during an upsert
CREATE POLICY "Users can update vocabulary"
  ON vocabulary FOR UPDATE
  TO authenticated
  USING (true);
