-- ============================================
-- Learn Swedish: Category Consolidation
-- Merging 26 granular topics down to 11 broad super-categories
-- ============================================

-- Nature & Animals
UPDATE vocabulary 
SET category = 'Nature & Animals' 
WHERE category IN ('nature', 'animals');

-- Travel & City
UPDATE vocabulary 
SET category = 'Travel & City' 
WHERE category IN ('city', 'travel', 'directions');

-- Body & Health
UPDATE vocabulary 
SET category = 'Body & Health' 
WHERE category IN ('body', 'health');

-- Food & Dining
UPDATE vocabulary 
SET category = 'Food & Dining' 
WHERE category IN ('food', 'food & drink', 'kitchen');

-- Home & Daily Life
UPDATE vocabulary 
SET category = 'Home & Daily Life' 
WHERE category IN ('everyday', 'daily life', 'home');

-- Tech & Media
UPDATE vocabulary 
SET category = 'Tech & Media' 
WHERE category IN ('technology', 'media');

-- Work & Study
UPDATE vocabulary 
SET category = 'Work & Study' 
WHERE category IN ('career', 'education');

-- Time & Numbers
UPDATE vocabulary 
SET category = 'Time & Numbers' 
WHERE category IN ('time', 'numbers');

-- Leisure & Fashion
UPDATE vocabulary 
SET category = 'Leisure & Fashion' 
WHERE category IN ('leisure', 'fashion');

-- People & Conversation
UPDATE vocabulary 
SET category = 'People & Conversation' 
WHERE category IN ('communication', 'greetings', 'emotions');

-- Core Grammar & Concepts
UPDATE vocabulary 
SET category = 'Core Grammar & Concepts' 
WHERE category IN ('abstract', 'adjectives', 'pronouns');
