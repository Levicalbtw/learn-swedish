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

3. Klockan är halv ett → 12:30'),

-- Lesson 7: Dagar & Månader (Days & Months)
('dagar-manader', 'Dagar & Månader — Days & Months', 'Learn the days of the week, the months of the year, and how to talk about time.', 'A1', 7,
'# Dagar & Månader — Days & Months

## Veckodagar (Days of the week)

| Swedish | English |
|---------|---------|
| **måndag** | Monday |
| **tisdag** | Tuesday |
| **onsdag** | Wednesday |
| **torsdag** | Thursday |
| **fredag** | Friday |
| **lördag** | Saturday |
| **söndag** | Sunday |

> 💡 **Grammar Trick:** Unlike English, days of the week are written with a **lowercase** letter in Swedish!

## Månader (Months)

| Swedish | English |
|---------|---------|
| **januari** | January |
| **februari** | February |
| **mars** | March |
| **april** | April |
| **maj** | May |
| **juni** | June |
| **juli** | July |
| **augusti** | August |
| **september** | September |
| **oktober** | October |
| **november** | November |
| **december** | December |

## Time Prepositions (When?)

To say something happens ON a day or IN a month, use these prepositions:

- **På** (On) for days: **på måndag** (on Monday)
- **I** (In) for months/seasons: **i juli** (in July)

> **Jag jobbar på tisdag.** — I work on Tuesday.
> **Vi reser till Sverige i augusti.** — We travel to Sweden in August.

## 💡 Did You Know?

In Sweden, **Friday** and **Saturday** are sacred. The concept of **Fredagsmys** ("Friday cozy") involves entire families sitting on the couch eating tacos and candy. Meanwhile, Saturday is **Lördagsgodis** ("Saturday candy")—the traditional day when children are allowed to eat sweets!

## Practice

Translate these phrases:
1. See you on Friday! → Vi ses **på fredag**!
2. My birthday is in May. → Min födelsedag är **i maj**.'),

-- Lesson 8: Basic Verbs
('basic-verbs', 'Att Ha, Att Göra, Att Gå — The 3 Power Verbs', 'Master the three most common verbs in the Swedish language.', 'A1', 8,
'# 3 Power Verbs: Ha, Göra, Gå

## The Best News About Swedish Verbs

In Swedish, verbs **do not change based on the person**. Whether it’s I, You, We, or They, the verb stays exactly the same!

## 1. Att Ha (To Have)
The present tense is **har**.

> **Jag har en hund.** — I have a dog.
> **Vi har en bil.** — We have a car.
> **Du har ett äpple.** — You have an apple.

## 2. Att Göra (To Do / To Make)
The present tense is **gör** (pronounced like "yer").

> **Vad gör du?** — What are you doing?
> **Jag gör mat.** — I am making food.
> **Han gör ingenting.** — He is doing nothing.

## 3. Att Gå (To Go / To Walk)
The present tense is **går**.

> **Jag går hem.** — I am walking home.
> **Tåget går klockan tre.** — The train leaves at three.

## 💡 Important: The Progressive Tense
English has two present tenses ("I eat" and "I am eating"). Swedish only has **one**.

"Jag går" means BOTH "I run" and "I am running". Don’t try to translate "I am doing"—just use the simple present verb!

## Practice

Which verb completes the sentence?
1. Jag _____ en katt. (I have a cat) → **har**
2. Vad _____ du? (What are you doing?) → **gör**
3. Vi _____ till skolan. (We are walking to school) → **går**'),

-- Lesson 9: Question Words
('frageord', 'Vem, Vad, Var — Question Words', 'Learn to ask the 6 essential questions in Swedish.', 'A1', 9,
'# Frågeord — Question Words

## The Core 6 Questions

To have any conversation, you need to know how to ask questions. Memorize these six core *frågeord* (question words).

| Swedish | English | Example |
|---------|---------|---------|
| **Vad?** | What? | **Vad** heter du? *(What is your name?)* |
| **Vem?** | Who? | **Vem** är det? *(Who is that?)* |
| **Var?** | Where? | **Var** bor du? *(Where do you live?)* |
| **När?** | When? | **När** kommer du? *(When are you coming?)* |
| **Varför?** | Why? | **Varför** är himlen blå? *(Why is the sky blue?)* |
| **Hur?** | How? | **Hur** mår du? *(How are you?)* |

## 💡 V2 Rule Reminder!

Remember the V2 Rule from Lesson 4? In Swedish, the verb *always* comes second. When you use a question word, the question word is in Position 1, so the **verb must immediately follow it**.

✅ **Var bor du?** (Where live you?)
❌ ~~Var du bor?~~

✅ **Vad gör han?** (What does he?)
❌ ~~Vad han gör?~~

## Practice

Translate the question words:
1. _____ jobbar du? (Where) → **Var**
2. _____ tid är det? (What) → **Vad**
3. _____ mycket kostar den? (How) → **Hur**'),

-- Lesson 10: Family Vocabulary
('familj', 'Familjen — The Swedish Family Tree', 'Learn how to describe your family using Sweden''s highly logical naming system.', 'A1', 10,
'# Familjen — The Family Tree

## Immediate Family

| Swedish | English |
|---------|---------|
| **mamma** | mom |
| **pappa** | dad |
| **bror / broder** | brother |
| **syster** | sister |
| **barn** | child |

## 💡 The Brilliant Grandparents System

In English, we just say "grandfather", which is confusing because it could be your mom''s dad or your dad''s dad. Swedish fixes this with pure logic! You literally squish the parents together.

- Father''s father = **farfar** (far + far)
- Father''s mother = **farmor** (far + mor)
- Mother''s father = **morfar** (mor + far)
- Mother''s mother = **mormor** (mor + mor)

> **Min mormor bor i Sverige.** — My maternal grandmother lives in Sweden.

## Aunts & Uncles

The same brilliant system applies here!

- Father''s brother = **farbror**
- Father''s sister = **faster**
- Mother''s brother = **morbror**
- Mother''s sister = **moster**

## Extending Sentences with "Min" (My)

- **Min mamma** (My mom)
- **Min pappa** (My dad)
- **Mitt barn** (My child - *ett-word!*)
- **Mina föräldrar** (My parents - *plural!*)

## Practice
Figure out the family member:
1. Din pappas mamma → **Farmor**
2. Din mammas bror → **Morbror**
3. Din syster och din bror → **Syskon** (siblings)')

ON CONFLICT (slug) DO NOTHING;
