-- ============================================
-- Learn Swedish: Lessons + User Lesson Progress
-- ============================================

CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'A1',
  lesson_order INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons readable by all authenticated users"
  ON lessons FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their own lesson progress"
  ON user_lessons FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON user_lessons FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson progress"
  ON user_lessons FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Seed A1 Lessons
INSERT INTO lessons (slug, title, description, level, lesson_order, content) VALUES

-- Lesson 1: Greetings
('greetings', 'Hej! — Greetings & Introductions', 'Learn essential Swedish greetings and how to introduce yourself.', 'A1', 1,
'# Hej! — Greetings & Introductions

## Key Phrases

| Swedish | English | When to use |
|---------|---------|-------------|
| **Hej!** | Hello! | Anytime, casual |
| **Hej då!** | Goodbye! | When leaving |
| **God morgon!** | Good morning! | Before noon |
| **God kväll!** | Good evening! | After 6 PM |
| **God natt!** | Good night! | Before bed |
| **Tack!** | Thank you! | Always useful! |
| **Tack så mycket!** | Thank you so much! | Extra polite |

## Introducing Yourself

The magic phrase is **"Jag heter..."** (My name is...).

> **Jag heter Anna. Vad heter du?**
> My name is Anna. What is your name?

To ask how someone is doing:

> **Hur mår du?** — How are you?
> **Jag mår bra, tack!** — I''m fine, thank you!

## 💡 Did You Know?

Swedes are famously casual! Even in business settings, people use **"hej"** instead of formal greetings. There is no real equivalent of "Sir" or "Madam" in daily Swedish.

## Practice

Try saying these out loud:
1. "Hej! Jag heter [your name]."
2. "Hur mår du?"
3. "Jag mår bra, tack!"'),

-- Lesson 2: Pronouns
('pronouns', 'Jag, Du, Han, Hon — Pronouns', 'Master Swedish personal pronouns and build simple sentences.', 'A1', 2,
'# Jag, Du, Han, Hon — Personal Pronouns

## The Pronouns

| Swedish | English | Example |
|---------|---------|---------|
| **Jag** | I | Jag bor i Sverige. (I live in Sweden.) |
| **Du** | You | Du är snäll. (You are kind.) |
| **Han** | He | Han läser. (He reads.) |
| **Hon** | She | Hon springer. (She runs.) |
| **Vi** | We | Vi äter middag. (We eat dinner.) |
| **De** | They | De spelar fotboll. (They play football.) |

## Building Simple Sentences

Swedish follows **Subject + Verb + Object** order (just like English!):

> **Jag dricker kaffe.** — I drink coffee.
> **Hon läser en bok.** — She reads a book.
> **Vi bor i Stockholm.** — We live in Stockholm.

## 💡 Pronunciation Tip

**"De"** (they) is pronounced **"dom"** — not "dee"! This trips up almost every beginner.

## The Verb "Att Vara" (To Be)

| Swedish | English |
|---------|---------|
| Jag **är** | I am |
| Du **är** | You are |
| Han/Hon **är** | He/She is |
| Vi **är** | We are |
| De **är** | They are |

Good news — **"är"** is the same for all pronouns! 🎉

## Practice

Translate these:
1. I am happy. → Jag är glad.
2. She is Swedish. → Hon är svensk.
3. We are here. → Vi är här.'),

-- Lesson 3: En & Ett
('en-ett', 'En & Ett — Swedish Noun Genders', 'Understand the two noun genders in Swedish and when to use each.', 'A1', 3,
'# En & Ett — Noun Genders

## The Two Genders

Swedish has two grammatical genders. Every noun is either **en-word** or **ett-word**:

| Gender | Article | Example |
|--------|---------|---------|
| **Common** (en) | en | **en** bok (a book) |
| **Neuter** (ett) | ett | **ett** hus (a house) |

~75% of Swedish nouns are **en-words** — when in doubt, guess "en"!

## Common En-Words

| Swedish | English |
|---------|---------|
| en katt | a cat |
| en hund | a dog |
| en bok | a book |
| en skola | a school |
| en dag | a day |

## Common Ett-Words

| Swedish | English |
|---------|---------|
| ett hus | a house |
| ett barn | a child |
| ett äpple | an apple |
| ett bord | a table |
| ett vatten | a water |

## 💡 Why Does This Matter?

The gender affects the **definite form** (the book vs. a book):

| Indefinite | Definite | English |
|-----------|----------|---------|
| en bok | bok**en** | the book |
| ett hus | hus**et** | the house |

For **en-words**, add **-en** at the end.
For **ett-words**, add **-et** at the end.

## Practice

Is it "en" or "ett"?
1. ___ katt → **en** katt
2. ___ hus → **ett** hus
3. ___ dag → **en** dag'),

-- Lesson 4: V2 Rule
('v2-rule', 'Verbet Kommer Tvåa — The V2 Rule', 'The most important Swedish grammar rule: the verb always goes second.', 'A1', 4,
'# The V2 Rule — Verbet Kommer Tvåa

## The Golden Rule

In Swedish main clauses, the **verb always goes in the second position**. This is called the **V2 rule** (Verb Second).

✅ **Jag dricker kaffe.** — I drink coffee.
(Subject first, verb second — same as English!)

## But What Happens When Something Else Comes First?

If you start with a time word or other element, the **subject and verb swap**:

✅ **Idag dricker jag kaffe.** — Today I drink coffee.
❌ ~~Idag jag dricker kaffe.~~ — WRONG!

The verb **must** stay in position 2:

| Position 1 | Position 2 (VERB) | Position 3 | Rest |
|-----------|-------------------|-----------|------|
| Jag | dricker | kaffe | varje dag |
| Idag | dricker | jag | kaffe |
| Varje dag | dricker | jag | kaffe |

## 💡 This is the #1 Mistake

Almost every Swedish learner makes this mistake. If you master V2, you''ll sound more natural than 90% of beginners!

## More Examples

> **Igår åt jag pizza.** — Yesterday I ate pizza.
> **Ofta läser hon böcker.** — Often she reads books.
> **I Stockholm bor vi.** — In Stockholm we live.

## Practice

Reorder these correctly:
1. (Imorgon / jag / ska / resa) → **Imorgon ska jag resa.** (Tomorrow I will travel.)
2. (Ofta / vi / äter / fisk) → **Ofta äter vi fisk.** (Often we eat fish.)'),

-- Lesson 5: Food
('food-drink', 'Mat & Dryck — Food & Drink', 'Essential food and drink vocabulary for daily life in Sweden.', 'A1', 5,
'# Mat & Dryck — Food & Drink

## Essential Words

| Swedish | English | Category |
|---------|---------|----------|
| **kaffe** | coffee | ☕ Drink |
| **te** | tea | ☕ Drink |
| **vatten** | water | 💧 Drink |
| **mjölk** | milk | 🥛 Drink |
| **bröd** | bread | 🍞 Food |
| **smör** | butter | 🧈 Food |
| **ost** | cheese | 🧀 Food |
| **fisk** | fish | 🐟 Food |
| **kött** | meat | 🥩 Food |
| **grönsaker** | vegetables | 🥬 Food |

## Useful Phrases

> **Kan jag få en kaffe?** — Can I have a coffee?
> **Jag vill ha vatten, tack.** — I would like water, please.
> **Maten är god!** — The food is good!
> **Vad vill du äta?** — What do you want to eat?
> **Jag är hungrig.** — I am hungry.
> **Jag är törstig.** — I am thirsty.

## 💡 Fika — The Swedish Way

**Fika** is the Swedish tradition of taking a coffee break, usually with a pastry. It''s not just drinking coffee — it''s a social ritual! Swedes fika multiple times a day.

Common fika items:
- **kanelbulle** — cinnamon bun 🤎
- **chokladboll** — chocolate ball 🍫
- **prinsesstårta** — princess cake 🎂

## Practice

Order at a Swedish café:
1. "Hej! Kan jag få en kaffe och en kanelbulle, tack?"
2. "Jag vill ha ett vatten."'),

-- Lesson 6: Numbers
('numbers-time', 'Siffror & Tid — Numbers & Time', 'Count in Swedish and tell the time.', 'A1', 6,
'# Siffror & Tid — Numbers & Time

## Numbers 1-20

| # | Swedish | # | Swedish |
|---|---------|---|---------|
| 1 | **en/ett** | 11 | **elva** |
| 2 | **två** | 12 | **tolv** |
| 3 | **tre** | 13 | **tretton** |
| 4 | **fyra** | 14 | **fjorton** |
| 5 | **fem** | 15 | **femton** |
| 6 | **sex** | 16 | **sexton** |
| 7 | **sju** | 17 | **sjutton** |
| 8 | **åtta** | 18 | **arton** |
| 9 | **nio** | 19 | **nitton** |
| 10 | **tio** | 20 | **tjugo** |

## Bigger Numbers

| Swedish | English |
|---------|---------|
| **trettio** | 30 |
| **fyrtio** | 40 |
| **femtio** | 50 |
| **hundra** | 100 |
| **tusen** | 1000 |

To combine: **tjugotre** = 23, **fyrtiosju** = 47

## Telling Time

> **Vad är klockan?** — What time is it?
> **Klockan är tre.** — It is three o''clock.
> **Klockan är halv fyra.** — It is 3:30 (half four).

## 💡 "Halv" Is Tricky!

In Swedish, **"halv fyra"** means **3:30** (half TO four), NOT 4:30! This is the opposite of what English speakers expect.

- **halv tre** = 2:30
- **halv fem** = 4:30
- **halv tolv** = 11:30

## Practice

What time is it?
1. Klockan är halv sex → 5:30
2. Klockan är tio → 10:00
3. Klockan är halv ett → 12:30')

ON CONFLICT (slug) DO NOTHING;
