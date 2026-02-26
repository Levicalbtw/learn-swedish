-- ============================================
-- Learn Swedish: Consistency Streak System
-- ============================================

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- We'll use a function to update streaks safely
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  today DATE := CURRENT_DATE;
  last_date DATE;
BEGIN
  -- Get the current user's last activity date
  SELECT last_activity_date INTO last_date FROM user_stats WHERE user_id = auth.uid();

  -- If no stats exist yet, create them
  IF last_date IS NULL THEN
    INSERT INTO user_stats (user_id, streak_count, last_activity_date, total_reviews)
    VALUES (auth.uid(), 1, today, 1)
    ON CONFLICT (user_id) DO UPDATE SET
      streak_count = 1,
      last_activity_date = today,
      total_reviews = user_stats.total_reviews + 1;
  ELSE
    -- If they already studied today, just increment total count
    IF last_date = today THEN
      UPDATE user_stats SET total_reviews = total_reviews + 1 WHERE user_id = auth.uid();
    -- If they studied yesterday, increment streak
    ELSIF last_date = today - INTERVAL '1 day' THEN
      UPDATE user_stats SET 
        streak_count = streak_count + 1,
        last_activity_date = today,
        total_reviews = total_reviews + 1
      WHERE user_id = auth.uid();
    -- If they skipped more than a day, reset streak to 1
    ELSE
      UPDATE user_stats SET 
        streak_count = 1,
        last_activity_date = today,
        total_reviews = total_reviews + 1
      WHERE user_id = auth.uid();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
