-- Allow authenticated users to insert new vocabulary from the Smart Flashcard generator
CREATE POLICY "Users can insert new vocabulary"
  ON vocabulary FOR INSERT
  TO authenticated
  WITH CHECK (true);
