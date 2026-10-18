# Steer Play

A mobile-first, interest-led playable advertising prototype for Steer. Phase 7 refines all seven experiences through a scrollable fictional Reels feed, seven explicitly selected audiences, working campaign links, isolated HTML5 previews and an optional friend-sharing loop. The final refinement adds an interactive guided demo, ten selectable alternative entertainment hooks, explicit demo return links, clearer public sharing, scientific copy corrections and expanded touch checks. No backend, login, database, external analytics or runtime AI is involved.

## Run locally

Use Node.js 22.20+ (or a compatible newer release).

```sh
npm ci
npm run dev
npm test
npm run test:e2e
npm run build
npm run preview
```

Vite prints the development URL. Browser tests start the dev server automatically and use locally installed Microsoft Edge. Set `channel` in `playwright.config.ts` to another installed Chromium browser if needed.

## Routes

| Route | Status |
| --- | --- |
| `/` | Discovery Hub with all seven experiences enabled |
| `/demo?guided=1` | Five-step interactive walkthrough with actual games, sharing and optional Steer handoff |
| `/demo` | Campaign studio, seven audiences, responsive comparison, friend-sharing loop, six linked strategy steps and all earlier game previews |
| `/demo/reels?profile=food` | Five-item, native-scroll fictional Reels feed with sponsored challenges at positions 3 and 5 |
| `/demo/reels?profile=puzzles&creative=case-file&reel=2` | Direct judge preview of a selected suitable creative; back navigation restores its position |
| `/demo/playable?profile=food&creative=quiz` | Real game in an isolated, same-origin HTML5 preview; all seven games selectable |
| `/c/quiz?profile=food&seed=reel-demo` | Consumer campaign entry; immediately replaces itself with the matching quiz route |
| `/c/predict?profile=lifestyle&scenario=weekend` | Consumer campaign entry preserving a public story variation |
| `/ad/puzzle` | Explicitly simulated, sponsored 9:16 Reel |
| `/play/missing-clue` | Complete game, science reveal and optional handoff |
| `/play/quiz` | Simple interest selection |
| `/play/quiz?interest=food&seed=demo123` | Immediate, reproducible five-question quiz |
| `/ad/quiz?interest=food&seed=demo123` | Matching sponsored quiz Reel simulation |
| `/play/predict?scenario=office` | Two illustrated predictions; also supports `family`, `college`, `weekend` |
| `/play/predict-the-twist` | Compatible alias for the original configured prediction route |
| `/play/signal-rush?seed=steer` | Deterministic symbol, memory and focus challenge |
| `/play/case-file?case=office` | Interactive clue investigation and deduction |
| `/ad/predict` | Sponsored story Reel simulation |
| `/ad/signal-rush` | Sponsored signal Reel simulation |
| `/ad/case-file` | Sponsored mystery Reel simulation |
| `/learn/metabolism` | Immediate interactive Quick Play |
| `/learn/metabolism?view=deeper` | Independent seven-chapter learning hub |
| `/learn/metabolism?view=deeper&chapter=glp1` | Direct access to a learning chapter |
| `/learn/metabolism?view=share` | Public, nonpersonal educational knowledge card |
| `/play/inside-metabolism` | Compatible alias for the original configured science-game path |
| `/learn/glp1` | Six immediate topic choices; no splash screen |
| `/learn/glp1?topic=safety` | Independent topic Quick Play |
| `/learn/glp1?view=library` | Explore All Questions |
| `/learn/glp1?view=library&topic=muscle` | Direct educational explanation, interaction, optional detail and sources |
| `/learn/glp1?view=share&topic=works` | Public educational sharing card |
| `/play/glp1-explained` | Compatible alias for the original planned route |
| `/ad/glp1` | Sponsored health-interest Reel prototype, directly opening `/learn/glp1` |
| Unknown paths | Recovery page |

## Architecture

- `src/pages/`: discovery, judge demo and simulated ad.
- `src/data/campaigns.ts`: seven typed audience profiles, seven primary creatives, suitable variations, guarded campaign routes, canonical public parameters and fictional feed data.
- `src/components/campaign/`: reusable creative artwork, sponsored creative shell, audience selector, campaign studio, audience comparison and friend-sharing demo.
- `src/pages/{ReelsSimulator,PlayablePreview,CampaignEntry}.tsx`: scroll-snap feed, isolated real-game preview and direct consumer entry.
- `src/games/MissingClue/`: local game state, observation, selection and feedback.
- `src/games/SteerPlayQuiz/`: question interaction, feedback, progress, result and replay.
- `src/games/PredictTheTwist/`: four adult scenarios, pure prediction state transitions and two distinct story interactions.
- `src/games/SignalRush/`: deterministic symbol configurations, pure round state and untimed visual matching.
- `src/games/CaseFile/`: fictional clue data, investigation state and a complete mystery flow.
- `src/games/InsideMetabolism/`: pure learning-state transitions, original SVG diagrams, seven optional chapters, Quick Play and the shareable knowledge card.
- `src/games/GLP1Explained/`: guarded mini-experience state, six visual interactions, independent topic library, source notes and educational cards.
- `src/types/healthQuestion.ts` and `src/data/glp1Questions.ts`: six stable question records with explanations, visual copy, sharing text, source-to-statement notes, limitations and review status.
- `src/hooks/useGLP1Events.ts`: Strict Mode-safe learning milestones without topic, choice or correctness data.
- `src/components/GLP1Demo.tsx` and `src/pages/HealthAd.tsx`: dedicated health-interest audience preview, example interaction and simulated Reel entry.
- `src/types/science.ts`: clinical lesson schema with content ID, simple/deeper explanations, caveats, source IDs, verification status and review status.
- `src/data/metabolismLessons.ts`: deterministic learning content and chapter configuration, separate from rendering.
- `src/hooks/useMetabolismEvents.ts`: anonymous learning events, once per actual milestone and playthrough.
- `src/types/quiz.ts`: typed interests, questions and session state.
- `src/data/interestConfigs.ts`: five interests, hooks and transition copy.
- `src/data/quizQuestions.ts`: 25 curated opening candidates, five science bridges and one shared discovery question.
- `src/utils/quizEngine.ts`: deterministic selection, answer locking, guarded progression, seed validation and challenge URLs.
- `src/utils/events.ts`: bounded, memory-only anonymous event buffer, with no server transmission.
- `src/components/`: shared shell, progress, feedback, reveal, completion, sharing, branding and SVG artwork.
- `src/data/gameConfigs.ts`: seven typed concepts and route availability.
- `src/data/scientificContent.ts`: sourced medical copy and review status.
- `src/data/gameScienceContent.ts`: six stable content IDs with statements, limitations, source IDs and pending clinical review metadata.
- `src/data/entertainmentAds.ts`: direct Reel-to-game configuration for the three new games.
- `src/hooks/useGameEvents.ts`: Strict Mode-safe, memory-only gameplay event lifecycle.
- `src/styles/index.css`: palette, typography, responsive layouts and reduced-motion support, integrated with Tailwind CSS.
- `src/styles/quiz.css`: quiz, interest selector, audience demo and matching Reel styles.
- `src/styles/entertainment.css`: story panels, signal field, clue board and new ad styles, loaded with the relevant routes.
- `src/styles/metabolism.css`: the interactive learning experience, independently loaded with learning/demo routes.
- `src/styles/glp1.css`: lightweight GLP-1 learning, card, demo and Reel styles, loaded on relevant routes.
- `src/styles/campaign.css`: route-loaded creative, feed, studio, comparison and preview layouts; active-only animation and reduced motion.
- `src/test/` and `e2e/`: component/integration and real-browser validation.

State stays within each game. Games compose `GameShell`, `GameProgress`, `ScienceReveal` and `GameCompletionScreen`; every completion includes the Steer website CTA. Enable a game only when its complete journey and tests are ready. The quiz loads with the app so direct links show a question without a route-loading screen. Missing Clue, the three new games, ads and judge routes load on demand.

## Gameplay and accessibility

Remember five objects on an Indian breakfast table, move on at your own pace, then choose what disappeared. Correct and incorrect answers both lead to helpful feedback and the same gut–brain discovery. There is no forced timer or score. The original arrangement has a text equivalent; selection uses native keyboard-accessible buttons. Focus moves to each new stage. Animations respect reduced motion. Share uses the native share sheet, then clipboard, then a visible selectable URL. Phase 6 corrects its default destination to `/play/missing-clue`, so a friend enters the game directly. The existing `/ad/puzzle` preview remains available. Deploy to an accessible origin before sharing beyond your device.

The quiz supports `food`, `gaming`, `entertainment`, `lifestyle` and `science`. A valid interest link opens Question 1 without a Start gate. An absent or invalid interest offers five choices. Missing or invalid seeds are replaced with a random non-identifying seed in the URL. Selection shuffles a copy of the relevant bank with a seeded PRNG: three unique opening questions, that interest’s bridge, then the shared GLP-1 discovery. Question and choice order are reproducible for the same interest, seed and deployed question-bank version. Editing the bank later can change seeded selections; versioned banks are a future publishing concern.

Each answer is locked once submitted, identifies the correct option and supplies a supportive explanation. Progression does not depend on correctness. The result includes the educational summary and all shared completion actions. Replay clears answers and restarts the same challenge. Changing interest or seed resets the session. Refresh retains the question set through the URL but resets progress; answer state is intentionally kept in memory. Quiz sharing contains only `interest` and `seed`, never answers, contact details or personal identifiers. A cancelled native share is reported as cancelled; rejected native sharing falls back to clipboard, then a selectable URL.

The judge selector updates the headline, first-question preview and both Reel and quiz destinations together. Each quiz Reel shows a preview question and three static preview choices; its labelled Play CTA opens that exact quiz. All targeting is explicitly simulated.

### Three new entertainment experiences

Predict the Twist opens on an illustrated story with three prediction cards. A follow-up evening scene offers two visual endings. Selected predictions receive an explanatory response; unsupported answers still progress. Four configurations cover office lunch, family dinner, adult postgraduate students (22 and 24), and a weekend routine. No fictional physiological outcome is asserted. The `scenario` selector resets the current story, and sharing preserves the selected scenario. Unknown scenarios visibly fall back to Office lunch.

Signal Rush starts with a large target and three tappable labelled shapes. The next round displays a three-symbol sequence; the player hides it when ready and chooses the middle symbol, with unlimited chances to inspect the pattern again before answering. The third round adds distracting arrows around the target shape. Shapes and choices reproduce for a given seed. No auto-expiring timer, audio, speed ranking or flashing is used. Missing or invalid seeds become random non-identifying seeds in the URL. Replay restarts the same pattern.

The Case File introduces a fictional adult, Arjun, and three expandable notes about sleep, meals and work. All three must be inspected before forming a deduction; collapsing an inspected clue does not erase the investigation. Players then choose a conclusion, see why a single clue cannot establish a cause, and reach the broader educational discovery. The one authored case is `office`; other case parameters visibly fall back to it. Replay resets inspected clues and the deduction.

All three have keyboard-accessible native controls and labelled illustrations, focused feedback, an accessible science stage, an optional Steer link, sharing and replay. New-stage scrolling keeps the next scene in view; reduced-motion settings suppress decorative transitions. Each shared URL contains just its public scenario, pattern seed or case. Refresh and replay reset gameplay; no answers are persisted or included in links.

### Inside Your Metabolism

Quick Play opens directly on an illustrated Indian lunch and a functional three-choice hook. Incorrect answers receive the same useful explanation and can continue. The core interactions are:

1. Tap Mouth, Stomach and Small intestine in order; the original SVG highlights the selected structure and reveals a short explanation. Completed points can be revisited.
2. Connect three shuffled glucose cards in learning order. Incorrect choices give a correction hint; correct cards visibly move into order and update a schematic of intestine, bloodstream, pancreas and body cells. This is not a glucose curve or clinical simulation.
3. Follow the gut–brain signal by tapping the icon on the pathway, then check the idea that several processes contribute to appetite.
4. Explore GLP-1 relationships with the gut, pancreas and brain. The insulin relationship is qualified by elevated blood glucose. The optional treatment note distinguishes endogenous hormone physiology from prescription receptor agonists without recommending a medicine.
5. Complete a final knowledge check, see the shared ScienceReveal summary, and finish with the shared GameCompletionScreen. No perfect score, contact details or Steer visit is required.

The result provides Explore Steer, Explore Deeper, Share What You Learned, Play Again and Explore More Games. Opening chapters or the knowledge card and returning preserves the current in-memory Quick Play state. Replay resets every interaction. Refresh starts Quick Play again; progress is deliberately not saved to persistent storage.

The independent learning hub has seven chapters: metabolism, after eating, glucose/insulin, hunger/fullness, gut–brain communication, GLP-1 and individual context. Every chapter has a short explanation, an interactive illustration, optional additional detail, source notes and back/next navigation. Public chapter IDs are `metabolism`, `after-eating`, `glucose`, `hunger`, `gut-brain`, `glp1`, and `context`. Invalid chapters show a recovery list; invalid views fall back to Quick Play. Nothing is locked behind gameplay, login or sharing.

The knowledge card contains a fixed educational message, Steer branding, a learning link and a visible pending-review notice. Web Share carries only this public title, message and `/learn/metabolism?view=share` URL. Clipboard and manual URL fallbacks preserve the same nonpersonal link. There are no answer, health-history, diagnosis, score or analytics parameters. A public or reachable LAN origin is required to share beyond the local device.

### GLP-1, Explained

Six concerns work as independent mini-experiences: how GLP-1 works, safety and side effects, muscle and physical health, stopping treatment, uses beyond diabetes, and individual clinical assessment. A topic opens directly on a two-choice question. Correct and incorrect answers both explain the supported answer. The next stage combines a short essential explanation and an interactive visual; exploring one label reveals a takeaway and enables completion. Other labels and deeper detail remain optional. Every completion uses the shared GameCompletionScreen with Explore Steer, Explore Another Question, sharing, replay and discovery return.

The six visual formats are a gut/pancreas/brain connection diagram, three expandable safety cards, a nutrition/activity/follow-up map, two illustrative planning paths, hormone-versus-prescription reveal cards, and a four-stage care sequence. They explain concepts without generating biological measurements or predicting outcomes. Safety information remains general and medicine-specific; the two paths show planning rather than comparative treatment results.

The independent library exposes the same content, visual interactions, deeper explanation and sources without requiring a quiz. A shared link opens that public topic explanation, with no answers or health data. Cards contain Steer branding, a fixed educational message and a pending-review notice. Web Share uses only the title, educational text and canonical library URL; clipboard copies that URL, with a selectable URL fallback. Cards do not export images. Returning from a card to the same Quick Play topic preserves its current in-memory state; replay resets it. Refresh and switching topics reset the playthrough.

Health interest is a dedicated audience option in the existing judge-personalisation preview. The five entertainment quiz interests remain unchanged. The health option provides an interactive example, sources and links to `/ad/glp1` and `/learn/glp1`. The Reel is explicitly a prototype simulation with no Instagram history or live targeting access.

## Local event tracking

The quiz records `quiz_opened`, `quiz_started`, `question_answered`, `quiz_completed`, `science_reveal_viewed`, `challenge_share_clicked` and `steer_cta_clicked`. The three new games also record `game_opened`, `round_started`, `round_completed` and `game_completed`. Events contain only the event name, game identifier and, when applicable, question or round number. There are no scores, answers, interests, seeds, URLs, timestamps, user identifiers, network calls or persistent storage. The buffer holds at most 100 events and clears on reload. It is exposed only as a typed utility for tests and future development, with no fabricated statistics in the UI.

The metabolism experience adds opened, digestion-completed, sequence-completed, gut–brain-explored, GLP-1-viewed, knowledge-check-completed, Quick Play-completed and deeper-learning-opened events. Its events contain only the name and `metabolism` game identifier. `knowledge_card_shared` is recorded only after the native share API resolves successfully; copying records `knowledge_card_copied` instead. A fallback or cancellation is not counted as a completed native share. CTA clicks use the existing event utility.

GLP-1 learning records `glp1_explained_opened`, `topic_selected`, `myth_answered`, `educational_reveal_viewed`, `deeper_explanation_opened`, `source_viewed`, `topic_completed`, successful knowledge-card sharing/copying and Steer clicks. Despite the event names, no selected topic, answer, correctness or concern is included: only the event name and `glp1` game identifier. Source events indicate opening the source notes. Native share success, copying and cancellation remain distinct. There is no network analytics or persistent learning history.

## Medical content and branding

All medical educational copy is **pending clinical review**, with no claim that approval has happened. The puzzle is explicitly an analogy and does not measure health. Medical decisions remain with qualified clinicians. No medicines or clinical outcomes are promoted.

Source: [NIDDK — Your Digestive System & How It Works](https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works), supporting the explanation that nerves and hormones help the digestive system communicate with the brain about hunger and fullness.

Quiz references include [NIDDK hormone research](https://www.niddk.nih.gov/news/archive/2021/story-discovery-medications-diabetes-obesity-emerged-research-pancreatic-hormone), the [NIDDK Gut Feelings workshop summary](https://www.niddk.nih.gov/-/media/Files/News/Meetings/NIDDK-April-2024-Gut-Feelings-Executive-Summary-508.pdf), and [NHLBI on sleep and health](https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects). Question feedback links to the relevant sources. The bank is curated for this prototype, not claimed to have editorial or clinical approval. All candidates retain pending review metadata. Clinical review is required for all five science bridges, the GLP-1 explanation, interest-to-health transitions and result copy before publication.

Phase 3 reuses those references and adds [NHLBI on clinical diagnosis of metabolic syndrome](https://www.nhlbi.nih.gov/health/metabolic-syndrome/diagnosis) as an example of assessment using history and several measurements. The story does not suggest that Arjun has that condition. Source metadata is attached to each new explanation; the visible review label and expandable sources travel with the content. All six new content records, story choices and scientific transitions need clinical review before publication. The programme introduction follows the supplied brief and also needs Steer’s approval.

Phase 4 adds [MedlinePlus on metabolism](https://medlineplus.gov/ency/article/002257.htm) and [NIDDK on blood glucose and insulin](https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes). These were verified alongside the existing NIDDK digestion, GLP-1 research and gut–brain references. References describe concepts; a link to a diabetes or metabolic-syndrome reference does not imply the learner has that condition. All new lessons remain **pending qualified clinical review**. Source verification means the reference was accessible and supports the concept; it does not mean the app’s wording has clinical approval. The compact “Sources & scientific notes” section exposes caveats and source links. No unavailable NCBI page is used as a verified reference.

The exact supplied colour palette is used. Headlines use DM Serif Display and body text uses DM Sans through Google Fonts, with local serif/sans fallbacks. No official vector wordmark was provided, so the current lowercase wordmark is a typographic approximation and should be replaced with the approved Steer asset before public release. All scene and card illustrations are lightweight local SVG components.

## Deploy to Vercel

Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`. `vercel.json` supplies SPA rewrites for direct route refreshes. No environment variables are needed. Hosting has not been published as part of this local implementation.

Phase 5 adds verified references to [NIDDK's prescription-treatment overview](https://www.niddk.nih.gov/health-information/weight-management/prescription-medications-treat-overweight-obesity), [MedlinePlus / ASHP medicine-specific information](https://medlineplus.gov/druginfo/meds/a618008.html), the [2025 joint nutrition and GLP-1 advisory](https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/oby.24336), and the [STEP 1 extension report](https://dom-pubs.onlinelibrary.wiley.com/doi/10.1111/dom.14725). The original GLP-1 and appetite references are reused. Each new topic identifies which statements its references support and their limits. The medicine-safety page is one product example, not a class-wide risk profile. The withdrawal study is exploratory subgroup follow-up after both medicine and structured lifestyle support stopped; its industry funding is disclosed. US information does not establish Indian approval or eligibility. No unavailable PMC page is relied on as a full-text source; the journal advisory PDF was accessible. All six records and every share card remain pending qualified clinical review. The sources do not endorse Steer or this application.

## Scope and Phase 7

- Obtain clinician approval of all educational copy and confirm programme wording with Steer.
- Replace the approximate wordmark with the official vector asset; self-host approved font files if required.
- Test on physical iOS and Android devices, including native sharing; static social previews need a public domain and social metadata per entry route.
- Validate comprehension and the 30–60-second GLP-1 Quick Play target with consenting adult users; review health-topic wording and local medicine-reference maintenance with qualified clinicians.
- Add versioned question banks and approved-review records before routinely changing publicly shared quizzes.
- Validate the hook and educational comprehension with consenting users; no performance or engagement outcomes have been measured.
- Real Meta campaigns and integrations remain out of scope. Any future server analytics require an explicit privacy and consent design.
- Confirm placement-specific requirements before packaging any real advertising asset; the HTML5 iframe preview establishes neither Meta eligibility nor native playable support within Instagram Reels.
- Test feed usability, accessibility, creative comprehension and voluntary sharing with consenting adults. No hook, learning-time, engagement or growth outcomes have been measured.

## Phase 2 file changes

Created:

- Types and configuration: `src/types/quiz.ts`, `src/data/interestConfigs.ts`, `src/data/quizQuestions.ts`.
- Selection and events: `src/utils/quizEngine.ts`, `src/utils/events.ts`.
- UI: `src/games/SteerPlayQuiz/index.tsx`, `src/components/InterestSelector.tsx`, `src/components/AudiencePreview.tsx`, `src/styles/quiz.css`.
- Tests: `src/test/quizEngine.test.ts`, `src/test/quiz.test.tsx`, `e2e/quiz.spec.ts`.

Modified:

- Routing and entry: `src/App.tsx`, `src/main.tsx`.
- Shared components: `src/components/GameShell.tsx`, `src/components/GameCompletionScreen.tsx`, `src/components/ShareChallenge.tsx`.
- Content and availability: `src/data/scientificContent.ts`, `src/data/gameConfigs.ts`.
- Pages: `src/pages/DiscoveryHub.tsx`, `src/pages/DemoMode.tsx`, `src/pages/AdSimulator.tsx`.
- Regression tests and docs: `src/test/app.test.tsx`, `README.md`, `VALIDATION.md`.

The existing Missing Clue game logic, brand palette, dependencies, Vercel configuration and seven-game roadmap are retained.

## Phase 3 file changes

Created:

- Games: `src/games/PredictTheTwist/{PredictTheTwist.tsx,scenarios.ts,predictionLogic.ts}`, `src/games/SignalRush/{SignalRush.tsx,signalPatterns.ts,signalLogic.ts}`, `src/games/CaseFile/{CaseFile.tsx,caseScenarios.ts,caseLogic.ts}`.
- Content and ads: `src/data/gameScienceContent.ts`, `src/data/entertainmentAds.ts`.
- Shared UI: `src/components/GameIllustrations.tsx`, `ScienceFootnote.tsx`, `RoundOutcome.tsx`, `EntertainmentCompletion.tsx`, `EntertainmentAdVisual.tsx`, `EntertainmentDemo.tsx`.
- Lifecycle and styling: `src/hooks/useGameEvents.ts`, `src/styles/entertainment.css`.
- Tests: `src/test/entertainmentLogic.test.ts`, `src/test/entertainment.test.tsx`, `e2e/entertainment.spec.ts`.

Modified:

- Routing, cards and demos: `src/App.tsx`, `src/data/gameConfigs.ts`, `src/pages/DiscoveryHub.tsx`, `src/pages/AdSimulator.tsx`, `src/pages/DemoMode.tsx`.
- Compatible shared extensions: `src/components/GameProgress.tsx`, `src/components/GameShell.tsx`, `src/components/ScienceReveal.tsx`.
- References, events, regression expectations and documentation: `src/data/scientificContent.ts`, `src/utils/events.ts`, `src/test/app.test.tsx`, `README.md`, `VALIDATION.md`.

Missing Clue, adaptive quiz, the shared completion and sharing implementations, dependency manifests and Vercel settings were preserved. No new packages, backend or authentication were introduced.

## Phase 4 file changes

Created:

- Lesson types/content: `src/types/science.ts`, `src/data/metabolismLessons.ts`.
- Learning experience: `src/games/InsideMetabolism/InsideMetabolism.tsx`, `metabolismLogic.ts`, `ScienceDiagrams.tsx`, `LessonNotes.tsx`, `LearningHub.tsx`, `KnowledgeCard.tsx`.
- Lifecycle, theme and judge preview: `src/hooks/useMetabolismEvents.ts`, `src/styles/metabolism.css`, `src/components/MetabolismDemo.tsx`.
- Tests: `src/test/metabolismLogic.test.ts`, `src/test/metabolism.test.tsx`, `e2e/metabolism.spec.ts`.

Modified:

- Routing, source registry and availability: `src/App.tsx`, `src/data/scientificContent.ts`, `src/data/gameConfigs.ts`.
- Compatible optional shared extensions: `src/components/GameCompletionScreen.tsx`, `src/components/ShareChallenge.tsx`, `src/components/ScienceReveal.tsx`, `src/components/ScienceFootnote.tsx`.
- Hub, judge and event integration: `src/pages/DiscoveryHub.tsx`, `src/pages/DemoMode.tsx`, `src/utils/events.ts`.
- Regression expectations and docs: `src/test/app.test.tsx`, `README.md`, `VALIDATION.md`.

All five entertainment game implementations and existing ad routes were retained. No dependencies, authentication, backend or runtime medical assistant were added. The 40–60-second Quick Play label is a design target; real-user reading time and educational comprehension have not yet been measured.

## Phase 5 file changes

Created:

- Types and content: `src/types/healthQuestion.ts`, `src/data/glp1Questions.ts`.
- Learning UI and logic: `src/games/GLP1Explained/{GLP1Explained.tsx,glp1Logic.ts,TopicVisual.tsx,TopicSources.tsx}`.
- Integration and styles: `src/hooks/useGLP1Events.ts`, `src/components/GLP1Demo.tsx`, `src/pages/HealthAd.tsx`, `src/styles/glp1.css`.
- Tests: `src/test/glp1Logic.test.ts`, `src/test/glp1.test.tsx`, `e2e/glp1.spec.ts`.

Modified:

- Routes, availability and references: `src/App.tsx`, `src/data/gameConfigs.ts`, `src/data/scientificContent.ts`.
- Discovery and judge integration: `src/pages/DiscoveryHub.tsx`, `src/pages/DemoMode.tsx`, `src/components/AudiencePreview.tsx`.
- Compatible optional sharing wording and events: `src/components/ShareChallenge.tsx`, `src/utils/events.ts`.
- Availability/route regressions and documentation: `src/test/app.test.tsx`, `e2e/metabolism.spec.ts`, `README.md`, `VALIDATION.md`.

No dependencies were added. All prior game implementations, existing ad routes and the five-interest quiz bank remain in place. Clinical approval, physical-device checks, public hosting, actual native share sheets and human completion timing remain outside this local implementation.

## Phase 6 campaign experience

Consumer links use `/c/:creativeId` and immediately replace themselves with an existing `/play/` or `/learn/` route. No judge explanation, login or extra Start page is inserted. `profile`, validated public seeds and whitelisted scenarios determine the variation; unknown query parameters are discarded. Unknown creatives offer a library recovery link. Invalid profiles fall back to Food & Cooking. The five-interest adaptive quiz engine remains the sole source of quiz selection and question ordering.

| Explicit demonstration profile | Suitable creatives, primary first |
| --- | --- |
| Food & Cooking | Quiz, Predict the Twist, Missing Clue |
| Gaming & Challenges | Signal Rush, Quiz |
| Entertainment & Storytelling | Predict the Twist, Case File, Quiz |
| Puzzles & Mysteries | Missing Clue, Case File, Signal Rush |
| Everyday Lifestyle | Predict the Twist, Quiz, Case File |
| Science & Curiosity | Inside Your Metabolism, Quiz, GLP-1 Explained |
| Metabolic Health & GLP-1 Education | GLP-1 Explained, Inside Your Metabolism |

The feed alternates two fictional organic illustrations, a sponsored challenge, another organic illustration and a second suitable sponsored creative. Artwork is original or reused local SVG. It uses no copyrighted video, real creator profiles, social-proof counts or engagement-history access. Kitchen, pattern, paper and everyday-desk scenes adapt to the chosen profile. Like/save controls only toggle in-memory demo state, with no real social activity. All sponsored creatives show their brand, hook, static visual preview and a working Play link from the opening frame. Decorative answers are labelled as previews; the actual interaction occurs in the destination game.

The portrait rail uses native touch/wheel scrolling and CSS snapping. Previous/Next controls and arrow/Home/End keys provide alternatives. Ads can be passed without launching a game. Profile switching resets to the first organic item; selecting a featured creative explicitly opens its preview. The URL retains the selected profile, creative and reel position so browser Back returns to the same invitation. Only the active reel can animate; reduced motion disables decorative animation and smooth programmatic scrolling. Inactive frames are inert and hidden from assistive technology until brought into view.

Judge Mode adds a campaign studio, desktop side-by-side comparison and mobile audience segmentation. Each comparison shows its hook, artwork, real destination, educational transition and shared Steer introduction. Six concise strategy steps link to working demonstrations. The previous interest-quiz and science previews remain available for detailed review.

The HTML5 preview loads the selected existing game route in one same-origin iframe. Changing the game replaces that instance. Its state and scrolling are isolated from the judge page; every original completion, replay, educational reveal and Steer link remains intact. This is an app-backed demonstration, not a self-contained exported ad ZIP or proof of eligibility for a Meta placement.

The Sharing Loop shows fictional participants Asha and Kabir. Create challenge link constructs the actual public game URL and invokes the shared Web Share/clipboard/manual fallback. Open as friend appears once the URL exists and opens a separate tab with `noopener noreferrer`. Creating a URL is distinct from successfully copying or sharing it. Changing the selected game or audience clears the previous generated link. No answers, histories, scores or personal identifiers enter the URL. Existing quiz seeds, story scenarios, signal patterns, case identifiers and educational topic links remain public and reproducible.

Simulator events are labelled local prototype activity and contain only event name plus the `simulator` game identifier. They cover opening, explicit audience selection, reel/creative exposure, CTA, game launch, link creation and friend opening. They use the existing 100-item memory-only buffer: no selected profile, creative, seed, answer, timestamp, persistent identifier or network analytics is recorded. Reload clears activity. No performance figures or growth claims are displayed.

## Phase 6 file changes

Created:

- Configuration: `src/data/campaigns.ts`.
- Campaign UI: `src/components/campaign/{AudienceControl,CampaignCreative,CreativeArtwork,CampaignStudio}.tsx`.
- Routes: `src/pages/{ReelsSimulator,PlayablePreview,CampaignEntry}.tsx`.
- Styles: `src/styles/campaign.css`.
- Tests: `src/test/campaigns.test.ts`, `src/test/campaign.test.tsx`, `e2e/campaign.spec.ts`.

Modified:

- Routing and judge/discovery entry: `src/App.tsx`, `src/pages/DemoMode.tsx`, `src/pages/DiscoveryHub.tsx`.
- Direct friend destination and anonymous events: `src/components/ShareChallenge.tsx`, `src/utils/events.ts`.
- Regression expectations: `src/test/app.test.tsx`, `src/test/quiz.test.tsx`, `e2e/journey.spec.ts`.
- Documentation: `README.md`, `VALIDATION.md`.

No dependencies or medical content records were added. All seven game implementations and existing ad routes were retained. All medical wording remains pending qualified clinical review. Mobile browser emulation, native API stubs and local preview do not replace physical-device, clinical, brand or public-host validation.

## Phase 7 audit and submission

See [final audit](docs/FINAL_AUDIT.md), [exact-copy scientific review](docs/SCIENCE_REVIEW.md), [submission](docs/SUBMISSION.md) and [two-minute recording script](docs/LOOM_SCRIPT.md). Rebuild the scientific inventory with `node scripts/science-audit.mjs`; this inventories copy and does not repeat external reference verification. With a production preview on port 4173, run `node scripts/performance-audit.mjs` for documented browser observer measurements. Lighthouse scores remain unverified in this environment.

Judge Mode offers Original, Alternative A and Alternative B openings for each entertainment creative. Reel links preserve `variant=curiosity` or `variant=challenge`; public game shares contain only the challenge configuration. No variant has measured performance results. Programme wording and medical content remain pending brand/clinical approval. No public deployment has been performed.
