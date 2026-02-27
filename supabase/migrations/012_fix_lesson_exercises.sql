-- Migration 012: Fix Lesson Exercise Answers
-- This migration wraps answers in <details> tags to hide them behind the "Check Answer" button we added to the UI.

UPDATE lessons SET content = REPLACE(content, '1. "Hej! Jag heter [your name]."', '1. "Hej! Jag heter [your name]."\n<details>Try saying: "Hej! Jag heter Ayden."</details>') WHERE slug = 'greetings';

UPDATE lessons SET content = REPLACE(content, '1. I am happy. → Jag är glad.', '1. I am happy.\n<details>**Jag är glad.**</details>') WHERE slug = 'pronouns';
UPDATE lessons SET content = REPLACE(content, '2. She is Swedish. → Hon är svensk.', '2. She is Swedish.\n<details>**Hon är svensk.**</details>') WHERE slug = 'pronouns';
UPDATE lessons SET content = REPLACE(content, '3. We are here. → Vi är här.', '3. We are here.\n<details>**Vi är här.**</details>') WHERE slug = 'pronouns';

UPDATE lessons SET content = REPLACE(content, '1. ___ katt → **en** katt', '1. ___ katt\n<details>**en** katt</details>') WHERE slug = 'en-ett';
UPDATE lessons SET content = REPLACE(content, '2. ___ hus → **ett** hus', '2. ___ hus\n<details>**ett** hus</details>') WHERE slug = 'en-ett';
UPDATE lessons SET content = REPLACE(content, '3. ___ dag → **en** dag', '3. ___ dag\n<details>**en** dag</details>') WHERE slug = 'en-ett';

UPDATE lessons SET content = REPLACE(content, '1. (Imorgon / jag / ska / resa) → **Imorgon ska jag resa.** (Tomorrow I will travel.)', '1. (Imorgon / jag / ska / resa)\n<details>**Imorgon ska jag resa.** (Tomorrow I will travel.)</details>') WHERE slug = 'v2-rule';
UPDATE lessons SET content = REPLACE(content, '2. (Ofta / vi / äter / fisk) → **Ofta äter vi fisk.** (Often we eat fish.)', '2. (Ofta / vi / äter / fisk)\n<details>**Ofta äter vi fisk.** (Often we eat fish.)</details>') WHERE slug = 'v2-rule';

UPDATE lessons SET content = REPLACE(content, '1. "Hej! Kan jag få en kaffe och en kanelbulle, tack?"', '1. Respond to: "Can I have a coffee and a bun?"\n<details>**"Hej! Kan jag få en kaffe och en kanelbulle, tack?"**</details>') WHERE slug = 'food-drink';
UPDATE lessons SET content = REPLACE(content, '2. "Jag vill ha ett vatten."', '2. Respond to: "I want a water."\n<details>**"Jag vill ha ett vatten."**</details>') WHERE slug = 'food-drink';

UPDATE lessons SET content = REPLACE(content, '3. Klockan är halv ett → 12:30', '3. Klockan är halv ett\n<details>**12:30** (Half TO one)</details>') WHERE slug = 'numbers-time';

UPDATE lessons SET content = REPLACE(content, '1. See you on Friday! → Vi ses **på fredag**!', '1. See you on Friday!\n<details>Vi ses **på fredag**!</details>') WHERE slug = 'dagar-manader';
UPDATE lessons SET content = REPLACE(content, '2. My birthday is in May. → Min födelsedag är **i maj**.', '2. My birthday is in May.\n<details>Min födelsedag är **i maj**.</details>') WHERE slug = 'dagar-manader';

UPDATE lessons SET content = REPLACE(content, '1. Jag _____ en katt. (I have a cat) → **har**', '1. Jag _____ en katt. (I have a cat)\n<details>**har**</details>') WHERE slug = 'basic-verbs';
UPDATE lessons SET content = REPLACE(content, '2. Vad _____ du? (What are you doing?) → **gör**', '2. Vad _____ du? (What are you doing?)\n<details>**gör**</details>') WHERE slug = 'basic-verbs';
UPDATE lessons SET content = REPLACE(content, '3. Vi _____ till skolan. (We are walking to school) → **går**', '3. Vi _____ till skolan. (We are walking to school)\n<details>**går**</details>') WHERE slug = 'basic-verbs';

UPDATE lessons SET content = REPLACE(content, '1. _____ jobbar du? (Where) → **Var**', '1. _____ jobbar du? (Where)\n<details>**Var**</details>') WHERE slug = 'frageord';
UPDATE lessons SET content = REPLACE(content, '2. _____ tid är det? (What) → **Vad**', '2. _____ tid är det? (What)\n<details>**Vad**</details>') WHERE slug = 'frageord';
UPDATE lessons SET content = REPLACE(content, '3. _____ mycket kostar den? (How) → **Hur**', '3. _____ mycket kostar den? (How)\n<details>**Hur**</details>') WHERE slug = 'frageord';

UPDATE lessons SET content = REPLACE(content, '1. Din pappas mamma → **Farmor**', '1. Din pappas mamma\n<details>**Farmor** (far + mor)</details>') WHERE slug = 'familj';
UPDATE lessons SET content = REPLACE(content, '2. Din mammas bror → **Morbror**', '2. Din mammas bror\n<details>**Morbror** (mor + bror)</details>') WHERE slug = 'familj';
UPDATE lessons SET content = REPLACE(content, '3. Din syster och din bror → **Syskon** (siblings)', '3. Din syster och din bror\n<details>**Syskon** (siblings)</details>') WHERE slug = 'familj';

UPDATE lessons SET content = REPLACE(content, '1. en bil → **bilar**', '1. en bil\n<details>**bilar**</details>') WHERE slug = 'plural-nouns';
UPDATE lessons SET content = REPLACE(content, '2. ett hus → **hus**', '2. ett hus\n<details>**hus**</details>') WHERE slug = 'plural-nouns';
UPDATE lessons SET content = REPLACE(content, '3. en flicka → **flickor**', '3. en flicka\n<details>**flickor**</details>') WHERE slug = 'plural-nouns';

UPDATE lessons SET content = REPLACE(content, '1. en _______ bil → **fin**', '1. en _______ bil\n<details>**fin**</details>') WHERE slug = 'adjectives';
UPDATE lessons SET content = REPLACE(content, '2. ett _______ hus → **fint**', '2. ett _______ hus\n<details>**fint**</details>') WHERE slug = 'adjectives';
UPDATE lessons SET content = REPLACE(content, '3. två _______ bilar → **fina**', '3. två _______ bilar\n<details>**fina**</details>') WHERE slug = 'adjectives';

UPDATE lessons SET content = REPLACE(content, '1. Jag _____ en hund. (had) → **hade**', '1. Jag _____ en hund. (had)\n<details>**hade** (from *ha*)</details>') WHERE slug = 'past-tense';
UPDATE lessons SET content = REPLACE(content, '2. Han _____ hem. (went) → **gick**', '2. Han _____ hem. (went)\n<details>**gick** (from *gå*)</details>') WHERE slug = 'past-tense';
UPDATE lessons SET content = REPLACE(content, '3. Vi _____ pizza. (ate) → **åt**', '3. Vi _____ pizza. (ate)\n<details>**åt** (from *äta*)</details>') WHERE slug = 'past-tense';

UPDATE lessons SET content = REPLACE(content, '1. It is going to snow. → Det **kommer att** snöa.', '1. It is going to snow.\n<details>Det **kommer att** snöa.</details>') WHERE slug = 'future-tense';
UPDATE lessons SET content = REPLACE(content, '2. I am going to drink coffee. → Jag **ska** dricka kaffe.', '2. I am going to drink coffee.\n<details>Jag **ska** dricka kaffe.</details>') WHERE slug = 'future-tense';
