-- Migration: Translate Lesson Titles to English
-- Updates the titles of the B1-C1 lessons to English to match the rest of the path.

UPDATE lessons SET title = 'Job Interviews' WHERE slug = 'job-interviews';
UPDATE lessons SET title = 'Swedish Geography' WHERE slug = 'swedish-geography';
UPDATE lessons SET title = 'Formal Writing' WHERE slug = 'formal-emails';
UPDATE lessons SET title = 'The Welfare System' WHERE slug = 'swedish-welfare-system';
UPDATE lessons SET title = 'Slang and Colloquialisms' WHERE slug = 'slang-and-colloquialisms';
