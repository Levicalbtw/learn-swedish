-- Migration: Fix Lesson Order Sequence
-- Corrects the lesson_order values for B2 and C1 lessons so they flow sequentially.

UPDATE lessons SET lesson_order = 23 WHERE slug = 'job-interviews';
UPDATE lessons SET lesson_order = 24 WHERE slug = 'swedish-geography';
UPDATE lessons SET lesson_order = 25 WHERE slug = 'academic-swedish';
UPDATE lessons SET lesson_order = 26 WHERE slug = 'debating-complex-topics';
UPDATE lessons SET lesson_order = 27 WHERE slug = 'idioms-and-expressions-part-2';

-- Note: The new C1 lessons (slugs: formal-emails, swedish-welfare-system, slang-and-colloquialisms) 
-- were already inserted with orders 28, 29, 30, which are now correct.
