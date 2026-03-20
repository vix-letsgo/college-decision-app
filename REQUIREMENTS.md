# Coffee Personality Quiz — Requirements

## Overview
A "What's Your Coffee Personality?" quiz for Basecamp Coffee. Customers answer fun pop culture questions and get a personality + coffee recommendation. Results show all personality percentages.

---

## Personality → Coffee Pairings

| Personality | Coffee | Tagline |
|-------------|--------|---------|
| Bold Adventurer | Double Espresso | "You live for intensity" |
| Sweet Enthusiast | Caramel Latte | "Life's too short for bitter" |
| Zen Minimalist | Black Coffee, Single Origin | "Simple. Clean. Perfect." |
| Night Owl | Red Eye (coffee + espresso shot) | "Sleep is optional" |
| Indulgent Treat | Mocha with Whip | "Coffee is dessert" |

---

## Result Display Style

**Option B: Show all percentages**

At the end of the quiz, show a full breakdown — e.g., "You're 50% Bold Adventurer, 30% Sweet Enthusiast, 20% Night Owl" — with coffee recommendations for each personality shown.

---

## Visual Style

**Warm & Cozy (Style 4)**
- Earth tones, soft gradients
- Background: warm beige/tan gradient (`#f5ebe0` → `#e8d5b7`)
- Card: frosted glass effect (white with transparency + blur)
- Accent color: warm terracotta/caramel (`#c8956c`)
- Typography: Playfair Display (headings) + Lato (body)
- Rounded corners, soft shadows
- Progress bar in warm caramel tone

---

## Images

Images downloaded to `public/` folder:
- `espresso.jpg` — Bold Adventurer
- `caramel-latte.jpg` — Sweet Enthusiast
- `black-coffee.jpg` — Zen Minimalist
- `red-eye.jpg` — Night Owl
- `mocha.jpg` — Indulgent Treat

---

## Icons

**Yes — include icons** next to each answer option (emoji style).

---

## Quiz Questions

### Q1: You're sorting yourself into a Hogwarts house. Which fits you best?
- ⚡ Gryffindor — brave, bold, first to volunteer → **Bold Adventurer**
- 🌿 Hufflepuff — loyal, warm, always has snacks → **Sweet Enthusiast**
- 💙 Ravenclaw — thoughtful, curious, needs quiet → **Zen Minimalist**
- 🐍 Slytherin — strategic, up late plotting greatness → **Night Owl**
- ✨ I'd bribe the Sorting Hat for the best common room → **Indulgent Treat**

### Q2: It's Friday night. What are you watching?
- 🧙 An epic fantasy series — give me all the worlds → **Bold Adventurer**
- 😂 A feel-good comedy I've seen 10 times → **Sweet Enthusiast**
- 🎬 A slow-burn arthouse film → **Zen Minimalist**
- 🌙 A thriller I shouldn't be watching alone at midnight → **Night Owl**
- 🍿 Something with a 90s rom-com energy → **Indulgent Treat**

### Q3: Which TV character are you at a party?
- 🗡️ Daenerys — showing up with dragons (metaphorically) → **Bold Adventurer**
- ☀️ Leslie Knope — organizing the snack table → **Sweet Enthusiast**
- 📚 Hermione — in the corner with a book → **Zen Minimalist**
- 🌑 Wednesday Addams — arrives fashionably late → **Night Owl**
- 👑 Blair Waldorf — the host, obviously → **Indulgent Treat**

### Q4: Pick your ideal travel destination:
- 🏔️ Patagonia hiking trek → **Bold Adventurer**
- 🌸 Japan in cherry blossom season → **Sweet Enthusiast**
- 🏯 Kyoto temple stays, total silence → **Zen Minimalist**
- 🌃 Tokyo at 2am, neon everywhere → **Night Owl**
- 🛳️ Mediterranean cruise with unlimited food → **Indulgent Treat**

### Q5: Which Netflix genre do you always click first?
- 🎯 Action & Adventure → **Bold Adventurer**
- 💌 Romance & Feel-Good → **Sweet Enthusiast**
- 🧘 Nature Documentaries → **Zen Minimalist**
- 🕵️ True Crime & Thrillers → **Night Owl**
- 🍰 Food & Travel Shows → **Indulgent Treat**

### Q6: Your friends describe you as:
- 🔥 The one who suggests the wild idea → **Bold Adventurer**
- 🤗 The one who remembers everyone's birthday → **Sweet Enthusiast**
- 🪴 The one who actually reads the whole menu → **Zen Minimalist**
- 🦉 The one who texts you at 1am with a great idea → **Night Owl**
- 🎁 The one who orders dessert and shares with everyone → **Indulgent Treat**

---

## Scoring Logic

Each answer maps to one personality. At the end, tally all answers and calculate a percentage for each personality. Display all 5 results ranked by percentage, with the top result highlighted as the primary personality.
