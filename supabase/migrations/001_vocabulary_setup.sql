-- ============================================
-- Learn Swedish: Database Setup
-- Tables: vocabulary, user_progress
-- ============================================

-- 1. Vocabulary table (shared word bank)
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swedish TEXT NOT NULL,
  english TEXT NOT NULL,
  example_sv TEXT,
  example_en TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  level TEXT NOT NULL DEFAULT 'A1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User progress table (per-user SRS state)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vocab_id)
);

-- 3. Row Level Security
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Vocabulary: everyone can read
CREATE POLICY "Vocabulary is readable by all authenticated users"
  ON vocabulary FOR SELECT
  TO authenticated
  USING (true);

-- User progress: users can only see/modify their own
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Seed A1 vocabulary
INSERT INTO vocabulary (swedish, english, example_sv, example_en, category, level) VALUES
  -- Greetings
  ('hej', 'hello', 'Hej! Hur mår du?', 'Hello! How are you?', 'greetings', 'A1'),
  ('hej då', 'goodbye', 'Hej då! Vi ses imorgon.', 'Goodbye! See you tomorrow.', 'greetings', 'A1'),
  ('tack', 'thank you', 'Tack så mycket!', 'Thank you so much!', 'greetings', 'A1'),
  ('ja', 'yes', 'Ja, det stämmer.', 'Yes, that is correct.', 'greetings', 'A1'),
  ('nej', 'no', 'Nej, tack.', 'No, thank you.', 'greetings', 'A1'),
  ('ursäkta', 'excuse me', 'Ursäkta, var är toaletten?', 'Excuse me, where is the bathroom?', 'greetings', 'A1'),
  ('god morgon', 'good morning', 'God morgon! Sov du gott?', 'Good morning! Did you sleep well?', 'greetings', 'A1'),
  ('god natt', 'good night', 'God natt! Sov gott!', 'Good night! Sleep well!', 'greetings', 'A1'),

  -- Numbers
  ('en', 'one', 'Jag vill ha en kaffe.', 'I want one coffee.', 'numbers', 'A1'),
  ('två', 'two', 'Vi har två katter.', 'We have two cats.', 'numbers', 'A1'),
  ('tre', 'three', 'Det finns tre rum.', 'There are three rooms.', 'numbers', 'A1'),
  ('fyra', 'four', 'Klockan är fyra.', 'It is four o''clock.', 'numbers', 'A1'),
  ('fem', 'five', 'Jag har fem fingrar.', 'I have five fingers.', 'numbers', 'A1'),

  -- Basics
  ('vatten', 'water', 'Kan jag få vatten?', 'Can I have water?', 'food & drink', 'A1'),
  ('kaffe', 'coffee', 'Jag dricker kaffe varje morgon.', 'I drink coffee every morning.', 'food & drink', 'A1'),
  ('mat', 'food', 'Maten är god!', 'The food is good!', 'food & drink', 'A1'),
  ('bröd', 'bread', 'Jag äter bröd till frukost.', 'I eat bread for breakfast.', 'food & drink', 'A1'),
  ('mjölk', 'milk', 'Vill du ha mjölk?', 'Do you want milk?', 'food & drink', 'A1'),

  -- Common words
  ('jag', 'I', 'Jag heter Anna.', 'My name is Anna.', 'pronouns', 'A1'),
  ('du', 'you', 'Vad heter du?', 'What is your name?', 'pronouns', 'A1'),
  ('han', 'he', 'Han bor i Stockholm.', 'He lives in Stockholm.', 'pronouns', 'A1'),
  ('hon', 'she', 'Hon läser en bok.', 'She is reading a book.', 'pronouns', 'A1'),
  ('vi', 'we', 'Vi går till skolan.', 'We go to school.', 'pronouns', 'A1'),

  -- Everyday
  ('hus', 'house', 'Det här är mitt hus.', 'This is my house.', 'everyday', 'A1'),
  ('skola', 'school', 'Barnen går till skolan.', 'The children go to school.', 'everyday', 'A1'),
  ('bok', 'book', 'Jag läser en bok.', 'I am reading a book.', 'everyday', 'A1'),
  ('dag', 'day', 'Det är en fin dag.', 'It is a nice day.', 'everyday', 'A1'),
  ('katt', 'cat', 'Katten sover.', 'The cat is sleeping.', 'everyday', 'A1'),
  ('hund', 'dog', 'Hunden springer.', 'The dog is running.', 'everyday', 'A1'),
  ('vänlig', 'friendly / kind', 'Han är mycket vänlig.', 'He is very friendly.', 'everyday', 'A1')
ON CONFLICT DO NOTHING;
