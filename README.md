# Steer Play

**Play. Discover. Understand.**

An interest-adaptive, mobile-first interactive advertising and learning experience that connects the things people already enjoy with clear, accessible metabolic-health education.

**[Live Website](https://steer-play.vercel.app/)** · **[Interactive Demo](https://steer-play.vercel.app/demo?guided=1)** · **[Reels Simulator](https://steer-play.vercel.app/demo/reels?profile=food)**

## The Problem

Most people scrolling through short-form videos are looking for entertainment, not advertising. Conventional health ads are easy to skip, especially when they immediately ask users to complete a lead form before answering their questions.

Metabolic health is also difficult to communicate in a few seconds. People may have heard about GLP-1 but still wonder what it does, how it relates to appetite, what risks treatments may carry, or why professional assessment matters. Generic advertising rarely provides an engaging way to explore these topics.

This creates two connected challenges:

- **Attention:** How do we offer something interesting enough for someone to voluntarily stop and interact?
- **Understanding:** How do we turn that interaction into useful, accurate information instead of another sales pitch?

## The Idea

**Start with the audience's interests, not the service being promoted.**

Steer Play creates different interactive entry points for people interested in food, games, films, puzzles, everyday stories, science, or metabolic health. A viewer encounters a short challenge matching a broad interest, taps to try it, and receives an entertaining result followed by a relevant educational discovery.

The experience does not require visitors to begin with an interest in healthcare. People can arrive for the game and choose whether to explore the science further. Those already interested in metabolic health can instead start with dedicated learning experiences that address their questions directly.

```text
Interest-based creative
        ↓
A question or challenge worth tapping
        ↓
Instant, interactive gameplay
        ↓
A useful metabolic-health insight
        ↓
Share with a friend / Learn more / Explore Steer
```

Sharing is optional, and so is visiting Steer. Users receive the explanation even if they take neither action.

## Features

- **Seven interactive experiences:** Five entertainment-first games and two dedicated health-learning experiences.
- **Interest-adaptive quiz:** Different opening questions for different interests, with a consistent science-backed conclusion.
- **Reels-style ad simulator:** A fictional, swipeable short-video feed that demonstrates how distinct creatives lead into the games.
- **Direct game entry:** Campaign links open the relevant playable experience without sign-up or an extra landing screen.
- **Shareable challenges:** Invite a friend to play through a direct link, with native sharing or clipboard fallbacks.
- **Educational reveals:** Brief explanations that connect the experience to appetite, gut–brain communication, glucose regulation, GLP-1, or the value of considering individual context.
- **Mobile-first presentation:** A portrait-oriented interface that remains mobile-sized and centered on larger displays.
- **Optional next step:** Each completed game provides a link to [steerclub.com](https://steerclub.com).

## Explore Steer Play

The discovery hub offers two ways into the experience: **five short entertainment-first games** under *“Start with what you love”*, followed by **two interactive learning experiences** under *“Get curious about you.”* Each experience starts with a familiar prompt and leads to an optional educational takeaway.

### Discovery Hub — Games

![Steer Play discovery hub featuring five playable games](docs/screenshots/discovery-games.png)

The first section introduces five distinct play styles: observation, trivia, prediction, quick thinking and mystery. Game cards show a short description and approximate play time, allowing visitors to start from a topic they find interesting.

### Discovery Hub — Explore the Science

![Steer Play discovery hub featuring Inside Your Metabolism and GLP-1 Explained](docs/screenshots/discovery-learning.png)

The second section offers a direct route into interactive learning, without requiring a visitor to complete an entertainment game first.

## The Seven Experiences

### 1. Find What Everyone Missed — Visual Observation

![Find What Everyone Missed game showing an illustrated Indian breakfast table with idlis and chai](docs/screenshots/missing-clue.png)

**[Play Find What Everyone Missed](https://steer-play.vercel.app/play/missing-clue)**

**The challenge:** Take a close look at a familiar breakfast table, then identify the detail that disappears. The opening scene contains a plate of idlis, a chai cup, a spoon, a napkin and a chutney bowl.

**How it works:** The player first observes the illustration, advances when ready, and then uses visual memory to find the missing item. The interface breaks the experience into *Observe → Find → Discover → Take away*, providing an educational explanation after the interaction.

**Why it belongs in Steer Play:** The observation exercise creates a memorable analogy for biological signals that can be easy to overlook. The game is not a medical or cognitive assessment; the health connection is an illustrative learning bridge.

### 2. Steer Play Quiz — Interest-Adaptive Trivia

![Steer Play Quiz interest-selection page with five categories](docs/screenshots/adaptive-quiz.png)

**[Play Steer Play Quiz](https://steer-play.vercel.app/play/quiz?interest=food)**

**The challenge:** Choose what makes you curious, then take a short five-question quiz. The screenshot shows the opening interest selector, which offers **Food & Cooking, Gaming & Challenges, Entertainment & Movies, Everyday Life & Lifestyle, and Science & Curiosity**.

**How it works:** The first three questions reflect the chosen interest, question four provides a related bridge into metabolic-health science, and the final question introduces GLP-1 fundamentals. Answer feedback is designed to teach rather than penalize; a missed question does not block the explanation.

**Why it belongs in Steer Play:** A single scientific foundation can be introduced through multiple interests without suggesting that a visitor's preference reveals anything about their personal health. The selected interest changes the questions, **not** a health assessment.

### 3. Predict the Twist — Everyday Story Prediction

![Predict the Twist game showing an illustrated office lunch scenario with Meera and Kabir](docs/screenshots/predict-the-twist.png)

**[Play Predict the Twist](https://steer-play.vercel.app/play/predict)**

**The challenge:** Two colleagues have lunch during the same break but follow different daily routines. What might happen next?

**How it works:** The player explores a fictional everyday scenario, makes a prediction, and sees a reveal that adds context. The opening screenshot features an *Office lunch* scenario in Bengaluru, with Meera, 29, and Kabir, 31. The experience follows *The scene → The twist → Discover → Take away* and can offer different fictional story variants.

**Why it belongs in Steer Play:** The story encourages curiosity about how routines and other circumstances can influence everyday experiences, without claiming that a meal or isolated clue can reliably predict an individual's biology.

### 4. Signal Rush — Quick Pattern Recognition

![Signal Rush first round asking players to match a square with the correct symbol](docs/screenshots/signal-rush.png)

**[Play Signal Rush](https://steer-play.vercel.app/play/signal-rush)**

**The challenge:** Recognize and select the matching symbol. The example screenshot shows a square target and three possible answers: square, diamond and circle.

**How it works:** The player moves through three short activities focused on *Match → Remember → Focus*, followed by *Discover → Take away*. Interactions are tap-friendly and self-paced: the screenshot explicitly notes that there is no countdown or audio pressure.

**Why it belongs in Steer Play:** Matching and recognizing signals creates a simple analogy for communication within biological systems, including gut–brain signalling. Performance in this pattern game does not indicate anything about a player's health or cognitive ability.

### 5. The Case File — Investigative Mystery

![The Case File game showing three expandable clues: sleep schedule, meal routine and work schedule](docs/screenshots/case-file.png)

**[Play The Case File](https://steer-play.vercel.app/play/case-file)**

**The challenge:** An adult character notices hunger appearing at different times during the week. Can the player interpret the clues without jumping to an oversimplified conclusion?

**How it works:** The player opens three clue cards — **Sleep schedule, Meal routine and Work schedule** — then makes a deduction. The experience progresses through *The clues → Deduce → Discover → Take away*. The story and character are fictional.

**Why it belongs in Steer Play:** The mystery makes an important point about context: a single symptom or routine change is not enough to establish its cause. This is an educational story, not diagnosis or individual medical guidance.

### 6. Inside Your Metabolism — Interactive Body Science

![Inside Your Metabolism interactive lesson asking what happens after a meal](docs/screenshots/inside-your-metabolism.png)

**[Explore Inside Your Metabolism](https://steer-play.vercel.app/learn/metabolism)**

**The experience:** Follow a meal through a simplified explanation of what happens inside the body. The first screen asks what occurs after lunch and presents answer choices alongside a warm illustrated plate of food.

**How it works:** Visitors choose an answer, receive an accessible explanation, and advance through a sequence of bite-sized science topics. The interface shows a seven-part learning journey, with a quicker route and an optional *Explore deeper* path.

**What it teaches:** Digestion, nutrient absorption, blood-glucose regulation, insulin, communication between the gut and brain, and introductory GLP-1 biology. Illustrations and interactions are simplified teaching aids, not a complete physiological model.

### 7. GLP-1, Explained — Guided Myth-or-Fact Learning

![GLP-1 Explained topic-selection page showing six questions about GLP-1 science and treatment considerations](docs/screenshots/glp1-explained.png)

**[Explore GLP-1, Explained](https://steer-play.vercel.app/learn/glp1)**

**The experience:** Start from a real question rather than a medical sales message. The opening page invites visitors to choose from six topics:

1. How GLP-1 works
2. Safety and side effects
3. Muscle and physical health
4. What happens after stopping treatment
5. GLP-1 beyond diabetes
6. Who decides whether treatment fits

**How it works:** A visitor chooses a topic, answers a myth-or-fact-style question, explores a plain-language explanation, and receives a takeaway. The page offers additional questions for visitors who want to keep learning.

**What it teaches:** The distinction between basic GLP-1 biology and medical treatment considerations, including risks, uncertainty and the importance of clinician-led decisions. It is intended as general education for adults, **not** a treatment eligibility test or prescription recommendation.

## Interest-Based Ad Experience

Steer Play contains a simulated vertical short-video feed. Visitors can scroll through fictional content, encounter a clearly marked sponsored Steer Play creative, skip it, or voluntarily tap through to an actual game.

The demo supports broad interest profiles and configurable creative variations. Different profiles change the hook, presentation, and game destination.

![Simulated Reels feed showing fictional creator content and audience/creative selectors](docs/screenshots/reels-simulator.png)

The screenshot shows the fictional feed, audience selector and featured-creative selector. It helps demonstrate how a campaign-facing creative can direct someone to a playable experience without implying access to real social media accounts.

**[Explore the Reels Simulator](https://steer-play.vercel.app/demo/reels?profile=food)**

> The feed is a **simulation**, not a connection to Instagram or Facebook. Steer Play does not read individuals' Reel-viewing histories or claim to run an HTML5 game natively inside an Instagram Reel.

A separate [HTML5 playable preview](https://steer-play.vercel.app/demo/playable) demonstrates interactive game behavior in a standalone preview environment.

## Sharing and Discovery

The sharing flow is designed around giving the next person something to *do*, rather than forwarding a generic advertisement.

```text
Person A completes a challenge
             ↓
Shares a direct game link
             ↓
Person B opens the same experience
             ↓
Plays without creating an account
             ↓
Learns, replays, or optionally shares
```

Where supported, public variation parameters allow a shared quiz or game configuration to be reproduced. Links should contain only public game settings, not personal health responses or private session details.

## Technology Stack

| Area | Technology |
| --- | --- |
| UI | React, TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS |
| Animation | Motion for React, CSS and SVG |
| Navigation | React Router |
| Icons | Lucide React |
| Game logic and content | TypeScript-based configurations and React components |
| Testing | Unit/integration and browser tests |
| Hosting | Vercel |

The application is frontend-first, with no login required for gameplay.

## Architecture

The interface is organized around a shared mobile application shell, independent game modules, structured content, and reusable completion and sharing components.

```text
Short-video simulator / direct campaign link
                    │
                    ▼
             Game route
                    │
                    ▼
      Interaction and answer logic
                    │
                    ▼
        Educational content layer
                    │
                    ▼
         Shared completion screen
             ├── Replay
             ├── Share challenge
             ├── Explore more games
             └── Explore steerclub.com
```

Keeping game content and scientific explanations separate from UI components makes it easier to reuse a game with different creative hooks while keeping educational copy consistent and reviewable.

### Key Routes

| Path | Purpose |
| --- | --- |
| `/` | Discovery hub |
| `/demo?guided=1` | Guided product walkthrough |
| `/demo/reels?profile=food` | Simulated short-video feed |
| `/demo/playable` | Standalone HTML5 playable preview |
| `/play/quiz?interest=food` | Interest-adaptive quiz |
| `/play/missing-clue` | Visual puzzle |
| `/play/predict` | Prediction game |
| `/play/signal-rush` | Pattern game |
| `/play/case-file` | Mystery game |
| `/learn/metabolism` | Interactive metabolism learning |
| `/learn/glp1` | GLP-1 learning experience |

## Design System

The interface uses Steer's warm, editorial visual identity.

| Token | Color |
| --- | --- |
| Cream — page background | `#F5EBDF` |
| Rust — primary accent | `#C04E2A` |
| Deep maroon — emphasis | `#661414` |
| Ink — primary text | `#351D1D` |
| Clay — secondary text | `#B58777` |
| Blush — borders | `#E6CBBD` |
| Soft paper — cards | `#F8F2EB` |

The design uses serif display headings, readable sans-serif text, restrained animation, lightweight illustrations, and touch-friendly controls. On desktops, the experience remains inside a centered mobile-width layout rather than stretching into a conventional desktop dashboard.

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Install

```bash
# Replace YOUR_USERNAME with the repository owner.
git clone https://github.com/YOUR_USERNAME/steer-play.git
cd steer-play
npm install
```

### Run locally

```bash
npm run dev
```

Open the address printed by Vite (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

For the available automated test commands, see the scripts in `package.json`.

## Deployment

**Live application:** [steer-play.vercel.app](https://steer-play.vercel.app/)

Steer Play is hosted on Vercel as a mobile-first web application. Client-side routes must be configured to resolve correctly when a visitor opens a game or challenge link directly or refreshes the page.

Users do not need to download an app or create an account.

## Validation and Current Limitations

The most recent developer-reported verification included **122 passing unit/integration tests, 64 passing browser tests, and 17 passing targeted reruns**, alongside a successful production build. The figures refer to the reported local verification and are not independent external certification.

Remaining considerations include physical-device testing, native mobile sharing checks, and performance improvements on some demo/Reels routes. Clinical and brand approval were not confirmed as completed.

## Medical Content and Privacy

Steer Play is an **educational prototype**. Its material should not be treated as individualized medical advice or a treatment recommendation.

- Games do not determine diagnosis or prescription eligibility.
- No specific prescription medicine is promoted.
- No before-and-after body imagery or guaranteed weight-loss outcomes are used.
- Medical explanations should be supported by verifiable sources and reviewed by qualified clinical professionals before public campaign use.
- Sharing links should not expose personal health information.
- Users can play without logging in or providing contact details.

The product demonstrates an advertising concept; it is not an officially connected Meta advertising service.

## Development and Credits

Steer Play was developed as a solo project. Product concept, game selection, creative approach, and development direction were defined by the creator. ChatGPT was used for ideation and technical planning, and OpenAI Codex assisted with implementation, debugging, testing, and refinement. The application uses open-source frontend tooling and Steer's supplied visual guidelines.

## Links

- **[Live App](https://steer-play.vercel.app/)**
- **[Guided Demo](https://steer-play.vercel.app/demo?guided=1)**
- **[Reels Simulator](https://steer-play.vercel.app/demo/reels?profile=food)**
- **[HTML5 Preview](https://steer-play.vercel.app/demo/playable)**
- **[Steer Website](https://steerclub.com)**

---

**Steer Play — Play. Discover. Understand.**
