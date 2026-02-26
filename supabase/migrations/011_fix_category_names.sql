-- ============================================
-- Learn Swedish: Category Name Fix-up
-- ============================================

-- This script finds vocabulary items where the category name is fallback-formatted
-- (e.g. "Lesson: 123") and replaces it with the actual Lesson Title if available.

UPDATE vocabulary v
SET category = 'Lesson: ' || l.title
FROM lessons l
WHERE v.category LIKE 'Lesson: %'
  AND (v.category = 'Lesson: ' || l.id::text OR v.category = 'Lesson: ' || l.id::uuid::text)
  AND l.title IS NOT NULL;

-- Also fix any entries that might have just been the UUID without the prefix
UPDATE vocabulary v
SET category = 'Lesson: ' || l.title
FROM lessons l
WHERE (v.category = l.id::text OR v.category = l.id::uuid::text)
  AND l.title IS NOT NULL;
