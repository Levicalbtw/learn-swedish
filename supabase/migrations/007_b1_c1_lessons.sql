-- Migration: B1, B2, C1 Swedish Lessons
-- Focuses on intermediate grammar, workplace vocabulary, media comprehension, and advanced fluency.

INSERT INTO lessons (slug, title, description, level, lesson_order, content)
VALUES
-- ==========================================
-- LEVEL B1 - INTERMEDIATE
-- ==========================================
(
    'expressing-opinions',
    'Expressing Opinions',
    'Learn how to smoothly state your opinion and agree or disagree politely in Swedish.',
    'B1',
    15,
    '# Expressing Opinions

Moving into intermediate Swedish means confidently sharing what you think! Swedes value consensus (*samförstånd*), but they definitely still debate.

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **att tycka** | to think (have an opinion) | Verb |
| **att tro** | to think (believe/guess) | Verb |
| **enligt mig** | according to me | Phrase |
| **jag håller med** | I agree | Phrase |
| **precis** | exactly | Adverb |
| **tvärtom** | on the contrary | Adverb |

> [!NOTE]
> **Tycka vs. Tro**
> This is a classic mistake for English speakers!
> - Use **tycka** when stating a subjective opinion based on experience (e.g., *Jag tycker att filmen är bra* - I think the movie is good).
> - Use **tro** when you are guessing or believing something without full knowledge (e.g., *Jag tror att det kommer att regna* - I think it will rain).

## Dialog: The Movie Review

Klara and Johan are leaving the cinema.

**Klara:** Vad **tyckte** du om filmen? (What did you think of the movie?)  
**Johan:** **Enligt mig** var den lite för lång. (According to me, it was a bit too long.)  
**Klara:** **Jag håller med** dig, men effekterna var fantastiska. (I agree with you, but the effects were fantastic.)  
**Johan:** **Precis**! Jag **tror** att den kommer att vinna många priser. (Exactly! I believe it will win many awards.)
'
),

(
    'work-life-in-sweden',
    'Work Life in Sweden',
    'Vocabulary for the office, dealing with colleagues, and the sacred concept of fika.',
    'B1',
    16,
    '# Work Life in Sweden

Working in Sweden is famously egalitarian. Organizations often have flat hierarchies where everyone is expected to voice their opinions, regardless of their title.

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **ett möte** | a meeting | Noun |
| **en kollega** | a colleague | Noun |
| **en arbetsplats** | a workplace | Noun |
| **vab (vård av barn)** | staying home with a sick child | Noun (Acronym) |
| **flexitid** | flexible working hours | Noun |
| **att samarbeta** | to cooperate | Verb |

## Cultural Concept: Flat Hierarchies
In a Swedish office, you usually address your boss by their first name. Decisions are often made collectively, which can result in *many* meetings, but ensures everyone feels heard.

## Dialog: Planning a Project

**Chef (Boss):** Hej allihopa. Vi måste **samarbeta** mer kring det nya projektet. (Hi everyone. We need to cooperate more on the new project.)  
**Arbetskamrat:** Vi kan ha ett kort **möte** imorgon bitti för att planera. (We can have a short meeting tomorrow morning to plan.)  
**Chef:** Tyvärr måste jag **vabba** imorgon, min son är sjuk. (Unfortunately I have to *vabba* tomorrow, my son is sick.)  
**Arbetskamrat:** Inga problem, vi tar det på fredag! (No problem, we''ll do it on Friday!)
'
),

(
    'booking-travel',
    'Booking Travel',
    'Navigate trains, flights, and hotels in Swedish like a local.',
    'B1',
    17,
    '# Booking Travel

Sweden has an extensive public transport system. Knowing how to book tickets and ask for directions is crucial for exploring outside the cities.

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **en tågbiljett** | a train ticket | Noun |
| **ett flyg** | a flight | Noun |
| **att boka** | to book | Verb |
| **en försening** | a delay | Noun |
| **ett vandrarhem** | a hostel | Noun |
| **enkel / tur och retur**| one-way / round trip | Adjective/Phrase |

## Grammar: Future Tense Formations

1. **Ska + Infinitive:** For firm plans or intentions. (*Jag ska resa imorgon.* - I am going to travel tomorrow.)
2. **Kommer att + Infinitive:** For predictions or events outside your control. (*Tåget kommer att bli försenat.* - The train is going to be delayed.)

## Dialog: At the Train Station

**Resenär:** Hej, jag vill **boka** en **tågbiljett** till Göteborg. (Hi, I want to book a train ticket to Gothenburg.)  
**Försäljare:** Vill du ha en **enkel** biljett eller **tur och retur**? (Do you want a one-way ticket or round-trip?)  
**Resenär:** Tur och retur, tack. Finns det några **förseningar** idag? (Round-trip, please. Are there any delays today?)  
**Försäljare:** Nej, allt rullar enligt tidtabellen! (No, everything is running according to schedule!)
'
),

(
    'health-and-body',
    'Health and the Body',
    'Learn vocabulary for body parts, feeling unwell, and visiting the doctor (vårdcentralen).',
    'B1',
    18,
    '# Health and the Body

Navigating the healthcare system (*vårdcentralen*) requires specific vocabulary. Let''s learn how to describe symptoms and body parts.

## Body Parts Vocabulary

| Swedish | English |
|---------|---------|
| **ett huvud** | a head |
| **en mage** | a stomach |
| **en rygg** | a back |
| **ett hjärta** | a heart |
| **en hals** | a throat/neck |

## Medical Phrases

| Swedish | English |
|---------|---------|
| **Jag är förkyld** | I have a cold |
| **Jag har ont i...** | I have pain in (my)... |
| **att ha feber** | to have a fever |
| **krya på dig!** | get well soon! |

> [!TIP]
> **"Ont i"**
> To say your [body part] hurts, you literally say "I have pain in [body part]".
> Example: *Jag har ont i magen* (My stomach hurts / I have a stomachache).

## Dialog: Calling the Clinic

**Sjuksköterska:** Vårdcentralen, vad kan jag hjälpa till med? (The health center, how can I help?)  
**Patient:** Hej. **Jag har ont i halsen** och **feber**. (Hi. I have a sore throat and a fever.)  
**Sjuksköterska:** Hur länge har du varit **förkyld**? (How long have you had a cold?)  
**Patient:** I tre dagar. (For three days.)  
**Sjuksköterska:** Vila mycket och drick vatten. **Krya på dig!** (Rest a lot and drink water. Get well soon!)
'
),

-- ==========================================
-- LEVEL B2 - UPPER INTERMEDIATE
-- ==========================================
(
    'hypothetical-situations',
    'Hypothetical Situations',
    'Master the Swedish conditional tense using "skulle".',
    'B2',
    19,
    '# Hypothetical Situations

At the B2 level, you need to talk about things that *could* happen, or what you *would* do. We form conditional sentences in Swedish using **skulle** (would).

## The Conditional Structure

**Om + [Condition in Past Tense], skulle + [Subject] + [Infinitive]**

If [condition happened], [subject] would [action].

*Example:* 
**Om** jag **hade** mycket pengar, **skulle** jag **köpa** ett hus i skärgården. 
(If I had a lot of money, I would buy a house in the archipelago.)

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **skulle** | would | Auxiliary Verb |
| **om** | if | Conjunction |
| **drömma (om)** | to dream (about) | Verb |
| **verklighet** | reality | Noun |
| **möjlighet** | possibility/opportunity| Noun |

## Dialog: The Lottery

**Kalle:** Vad **skulle** du göra **om** du vann på lotto? (What would you do if you won the lottery?)  
**Lena:** **Om** jag vann mycket pengar, **skulle** jag sluta jobba och resa jorden runt. (If I won a lot of money, I would stop working and travel around the world.)  
**Kalle:** Det låter som en fantastisk **möjlighet**. Men tyvärr är det inte **verklighet** än. (That sounds like a fantastic opportunity. But unfortunately it is not reality yet.)
'
),

(
    'news-and-media',
    'News and Media',
    'Vocabulary for reading Swedish newspapers and discussing current events.',
    'B2',
    20,
    '# News and Media

Understanding the news (*nyheter*) is a major milestone for language learners. The vocabulary is more formal and the sentence structures are often passive.

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **en nyhet** | a piece of news | Noun |
| **en rubrik** | a headline | Noun |
| **samhället** | the society | Noun |
| **att rapportera** | to report | Verb |
| **en händelse** | an event/incident | Noun |
| **regeringen** | the government | Noun |

## Grammar: The Passive Voice (s-passiv)

In newspapers, things *are done* without always stating *who* did them. You form this in Swedish by adding an -s to the end of the verb.

*Active:* Polisen arresterade tjuven. (The police arrested the thief.)
*Passive:* Tjuven arresterade**s** av polisen. (The thief was arrested by the police.)

## Dialog: Morning Coffee

**Anna:** Läste du **rubrikerna** i morse? (Did you read the headlines this morning?)  
**Sven:** Ja, det **rapporterades** om den nya lagen som **regeringen** har föreslagit. (Yes, it was reported about the new law the government has proposed.)  
**Anna:** Det kommer att påverka hela **samhället**. (It is going to affect the whole society.)
'
),

(
    'the-passive-voice-deep-dive',
    'Deep Dive: Passive Voice',
    'Mastering the S-Passive and Bli-Passive for professional Swedish.',
    'B2',
    21,
    '# Deep Dive: The Passive Voice

Following up on the News lesson, let''s master the passive voice. Swedes use the passive voice very frequently, especially in instructions, news, and academic writing.

## The Two Passives

There are two main ways to form the passive voice in Swedish:

### 1. The S-Passive (Most Common)
You attach an `-s` to the verb. If the present tense verb ends in `-r` (like *köper*), you drop the `-r` and add `-s` (*köpes*).

* **Huset säljs imorgon.** (The house is being sold tomorrow.)
* **Dörren öppnas.** (The door is opening / is being opened.)

### 2. The Bli-Passive (Often implies a change of state)
Formed using the verb **att bli** (to become) + the past participle.

* **Han blev vald.** (He was elected.)
* **Maten blev uppäten.** (The food was eaten up.)

## When to use which?
The *s-passive* is usually used for general rules or ongoing processes. The *bli-passive* focuses on the result of a specific action.

## Example: Instructions
You will see the s-passive everywhere on Swedish packaging!

> *Förvaras torrt och svalt.* (Store dry and cool - literally: Is [to be] stored dry and cool.)
> *Öppnas här.* (Open here - literally: Is [to be] opened here.)
'
),

(
    'idioms-and-expressions',
    'Idioms and Expressions Part 1',
    'Start sounding like a native with common Swedish idiomatic phrases.',
    'B2',
    22,
    '# Idioms and Expressions

To truly master a language, you have to go beyond literal translations. Swedish is full of funny, vivid idioms!

## Common Idioms

| Swedish Phrase | Literal Translation | True Meaning |
|----------------|---------------------|--------------|
| **Att glida in på en räkmacka** | To slide in on a shrimp sandwich | To get something easily / have an easy life |
| **Att köpa grisen i säcken** | To buy the pig in the sack | To buy something without inspecting it first |
| **Ingen ko på isen** | No cow on the ice | There''s no danger / No need to worry |
| **Att kasta yxan i sjön** | To throw the axe in the lake | To give up completely |

## Contextualizing "Ingen ko på isen"

This means "Don''t worry, everything is under control." 
The full old expression is *Det är ingen ko på isen så länge rumpan är i land* (There is no cow on the ice as long as the behind is on land).

**Dialog:**

**Maria:** Hjälp, jag glömde presentationen hemma! (Help, I forgot the presentation at home!)  
**Oskar:** Ta det lugnt, **ingen ko på isen**. Mötet börjar inte förrän i eftermiddag, du hinner hämta den. (Take it easy, no need to worry. The meeting doesn''t start until this afternoon, you have time to get it.)
'
),

-- ==========================================
-- LEVEL C1 - ADVANCED
-- ==========================================
(
    'academic-swedish',
    'Academic Swedish',
    'High-level vocabulary for reading literature and writing university essays.',
    'C1',
    23,
    '# Academic Swedish

At the C1 level, fluency is no longer about survival—it''s about nuance. Academic and literary Swedish often utilizes vocabulary derived from Latin, German, and old Norse that is rarely used in spoken street-language.

## Key Vocabulary

| Swedish | English | Part of Speech |
|---------|---------|----------------|
| **ett syfte** | a purpose/aim | Noun |
| **en förutsättning**| a prerequisite / condition | Noun |
| **fenomenet** | the phenomenon | Noun |
| **att betona** | to emphasize | Verb |
| **således** | thus / consequently | Adverb |
| **däremot** | however / on the other hand | Adverb |

## Structuring an Argument

In academic writing, transitional adverbs are crucial.

*   *Å ena sidan... å andra sidan...* (On one hand... on the other hand...)
*   *Dessutom...* (Furthermore...)
*   *Följaktligen...* (Consequently...)

## Reading Snippet: An Essay Intro

"**Syftet** med denna studie är att undersöka språkinlärning. En viktig **förutsättning** är exponering. Unga lär sig snabbt, de äldre är **däremot** mer analytiska. **Således** måste vi **betona** vikten av anpassad pedagogik."

*(The purpose of this study is to examine language learning. An important prerequisite is exposure. The young learn quickly; the elderly, however, are more analytical. Thus, we must emphasize the importance of adapted pedagogy.)*
'
),

(
    'debating-complex-topics',
    'Debating Complex Topics',
    'How to respectfully disagree and present counter-arguments in Swedish society.',
    'C1',
    24,
    '# Debating Complex Topics

Swedes value consensus, but that doesn''t mean they don''t debate deeply on politics, climate change, and economics. To debate effectively at a C1 level, you need language that is polite, firm, and precise.

## Advanced Argumentative Phrases

| Swedish Phrase | English Equivalent |
|----------------|--------------------|
| **Jag är av den uppfattningen att...** | I am of the opinion that... |
| **Man kan argumentera för att...** | One could argue that... |
| **Jag ställer mig tvivlande till...** | I am doubtful regarding... |
| **Åtminstone i det här avseendet** | At least in this regard |
| **Det beror helt och hållet på...** | That depends entirely on... |

## Dialog: Panel Discussion

*Context: A TV debate on urban planning.*

**Debattör 1:** **Jag är av den uppfattningen att** vi måste bygga fler höghus i centrum för att lösa bostadskrisen. 
*(I am of the opinion that we must build more high-rises in the center to solve the housing crisis.)*

**Debattör 2:** **Man kan argumentera för att** det löser krisen på kort sikt, men **jag ställer mig tvivlande till** att det är en hållbar lösning. Det förstör stadsbilden. 
*(One could argue that it solves the crisis in the short term, but I am doubtful regarding it being a sustainable solution. It ruins the cityscape.)*

**Debattör 1:** **Det beror helt och hållet på** hur man designar dem!
*(That depends entirely on how you design them!)*
'
),

(
    'idioms-and-expressions-part-2',
    'Idioms and Expressions Part 2',
    'Advanced idiomatic phrasing and untranslatable Swedish concepts.',
    'C1',
    25,
    '# Idioms and Expressions Part 2

Welcome to the final lesson of the core curriculum! Let''s look at some advanced idioms and concepts that will make you sound incredibly native.

## Idioms of Confusion and Frustration

| Swedish Phrase | Literal Translation | True Meaning |
|----------------|---------------------|--------------|
| **Att kasta ett öga på något** | To throw an eye on something | To take a quick look at something |
| **Hålla tummarna** | Hold the thumbs | To cross one''s fingers (hope for good luck) |
| **Göra en höna av en fjäder** | Make a hen out of a feather| To make a mountain out of a molehill (exaggerate) |
| **Vara ute och cykla** | To be out and cycling | To be completely wrong / off track |

## Untranslatable Words

*   **Vab (Vård av Barn):** As we learned in B1, this is the legal right to stay home with a sick child while getting paid by the state.
*   **Orka:** To have the energy or fortitude to do something. ("Jag orkar inte" - I can''t be bothered / I don''t have the energy).
*   **Lagom:** Not too much, not too little. Just right. The cornerstone of Swedish philosophy.

## Dialog: The Stressful Project

**Lotta:** Chefen gör verkligen **en höna av en fjäder** över den här rapporten. (The boss is really making a mountain out of a molehill over this report.)  
**David:** Verkligen. Han **är helt ute och cyklar** om försäljningssiffrorna. Jag **orkar** nästan inte diskutera med honom mer. (Truly. He is completely off track regarding the sales numbers. I almost don''t have the energy to argue with him anymore.)  
**Lotta:** Vi får **hålla tummarna** att fredagsmötet går bättre. (We''ll have to cross our fingers that the Friday meeting goes better.)
'
);
