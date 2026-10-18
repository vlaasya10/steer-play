# Phase 7 final verification - 18 October 2026

All seven experiences remain available. Current results: **122 unit/integration tests passed**, **64 browser cases passed in the complete suite**, then **17 affected cases passed again after the final copy/navigation fixes**. Zero failures/skips in those completed final checks; TypeScript and production build passed. This is 186 unique cases and 203 executions in the final completed-check table, excluding baseline and intermediate diagnostics. The interrupted copy-check run and earlier replay timeout are disclosed in [FINAL_AUDIT.md](docs/FINAL_AUDIT.md).

Mobile touch coverage: 320, 360, 375, 390, 414 and 430px, all seven complete ad-to-game journeys, public fresh-recipient links and replay. Short-phone artwork, guided demo return state, ten opening alternatives, browser navigation, keyboard and reduced motion are covered. Physical-device and native OS share-sheet checks remain pending.

See the [final audit](docs/FINAL_AUDIT.md), [scientific review](docs/SCIENCE_REVIEW.md), [submission](docs/SUBMISSION.md) and [recording script](docs/LOOM_SCRIPT.md). LCP medians met 2.5s on four of six measured candidate routes; guided demo and Reels medians did not. Observed CLS stayed below 0.1. Lighthouse scores are unavailable. Medical/brand approval remains pending. Nothing was deployed.

The sections below are historical records of earlier phases.

# Phase 6 validation

Verified locally on 18 October 2026. Earlier phase records are retained below.

| Check | Result |
| --- | --- |
| Baseline | 107 unit/integration tests, 47 Edge browser tests and production build passed before changes |
| Existing issue identified | Missing Clue shared its ad preview; default sharing now enters the real game directly |
| Unit/integration | All 122 tests across 11 files passed in the final run |
| Browser regression | All 56 Edge browser tests passed in the final uninterrupted run (4.0 minutes), including nine new campaign cases |
| TypeScript/build | Production build including strict TypeScript passed |
| Profiles and mapping | All seven explicit profiles, multiple suitable creatives, all seven primary games, distinct hooks and guarded parameters |
| Consumer entry | Real routes open directly; quiz interest/seed and story/signal variations retained; no judge UI or login |
| Feed | Native wheel scrolling, emulated touch swipe, CSS snapping, keyboard Home/arrows, previous/next, ad skipping and audience switching |
| Mobile | 360, 390 and 430px; all seven creative launches, visible CTAs, 9:16 frames, no horizontal or creative-content overflow |
| Back navigation | Returns from a launched game to the same profile, creative and reel position |
| HTML5 preview | First interaction exercised in all seven existing games inside a real iframe; Missing Clue completed with original science, sharing and Steer handoff |
| Friend loop | Actual public seed/scenario links, clipboard/manual fallback, isolated recipient tab and unchanged sender page |
| Comparison | Both audiences visible on desktop; segmented mobile view; actual creatives and working destinations |
| Motion | Active-only animation, reduced-motion static state and accessible native controls |
| Privacy | Simulator events contain only name/game; no profile, creative, seed, answer, identifier, timestamps or network payload |

Baseline issue and fix: Missing Clue's shared `/ad/puzzle` link required a second ad CTA. The new default is `/play/missing-clue`; the old ad route remains functional. Other games already shared public playable or educational variations. Legacy quiz regression assertions were scoped to their existing audience region because the new comparison intentionally repeats some creative headlines.

The nine campaign browser cases cover every profile and every primary creative at each requested width, actual in-game first moves, backward navigation, a completed iframe game, a genuine recipient popup and browser-emulated touch input. Decorative answer previews are separate from active game controls. The previous completion tests continue to verify all seven optional Steer website links.

The final run also verifies that the recipient window has no opener, the guided sharing link scrolls to its actual section, and iframe screenshots wait for the content transition to finish. All previous 47 browser cases passed. Screenshots are generated under ignored `test-results/`; each browser run resets that directory. The local Reels route returns HTTP 200 and the existing dev server remains running for review.

New local SVG compositions were visually inspected for all seven creatives, the desktop studio, the full-height mobile feed and the embedded completion. No videos, real profiles, copied social content or fabricated engagement counts are used. Like/save feedback explicitly applies only to the demo. The five feed items are intentionally a small prototype rather than an infinite recommendation system.

Initial JavaScript remains approximately 144.5 kB gzipped across the entry and shared runtime chunks; initial CSS is approximately 9.4 kB. Campaign CSS is approximately 3.1 kB gzipped and route-loaded. Feed code is approximately 2.5 kB, campaign configuration 2.5 kB, the shared creative renderer 2.4 kB and iframe route 1.1 kB, excluding shared artwork/data already used elsewhere. Games remain lazy-loaded apart from the pre-existing upfront quiz. No dependencies were added.

## Phase 6 limits and Phase 7

Tests use desktop Edge, mobile viewports and browser-emulated touch rather than physical phones. Native Web Share paths use existing API stubs; actual OS share sheets and cross-device delivery remain unverified. Localhost URLs require an accessible hosted or LAN origin for another device. Browser popups are opened only after a user click and may be subject to browser settings.

The HTML5 route is an isolated instance of the running application, not an exported placement-ready package. There is no real Meta connection, account access, live campaign, actual audience inference or assertion of playable eligibility inside Reels. No human study has verified the three-second hook, learning-time targets, comprehension, engagement or growth. Existing medical content remains pending qualified clinical review and official brand-asset approval remains pending.

Recommended Phase 7: clinician and brand approval, consenting-user hook/comprehension/timing studies, physical iOS/Android accessibility and sharing checks, public deployment with social previews, and separate placement-specific technical review before packaging real ad assets.

## Phase 5 validation record

Verified locally on 18 October 2026. The Phase 4 record is retained below.

| Check | Result |
| --- | --- |
| Baseline before changes | 88 unit/integration tests, 39 Edge browser tests and production build passed |
| Unit/integration tests | 107 tests across nine files passed |
| TypeScript and production build | Passed via `npm run build` |
| Full browser regression | All 47 Edge browser tests passed in the final uninterrupted run (3.3 minutes) |
| Topic availability | All seven experiences enabled; the original GLP-1 planned route remains a working alias |
| Six independent Quick Plays | Correct and incorrect feedback, guarded progression, visual exploration, takeaway, completion and replay tested |
| Six independent library topics | Direct entry without a quiz, explanation, interactive visual, optional detail, sources and library navigation tested |
| Medical records | Six stable IDs, two-choice challenges, source-to-statement support notes, limitations, verified reference status and pending clinical review |
| Sharing privacy | Native success tested for every topic; copying, native failure, cancellation and manual fallback tested; only fixed public content and canonical topic URL shared |
| Anonymous events | Strict Mode-safe milestones; only name and game identifier, no selected topic, answer, correctness, health data or network requests |
| Mobile | Six initial cards visible without scrolling at 360, 390 and 430px; Quick Plays, independent topics and share cards have no horizontal overflow |
| Accessibility | Native buttons and details, keyboard answers and diagram labels, feedback and stage focus, reduced motion |
| Health-interest entry | Judge audience choice, interactive source-backed example, simulated sponsored Reel and direct learning CTA |
| Steer handoff | Shared completion with working Steer URL, another question, sharing, replay and discovery return |
| Invalid/direct links | Unknown topic or section recovers to selection; direct topic routes and legacy-route refresh work |

New browser cases cover all six topics at each requested width, all six library and sharing views at each width, the judge-to-Reel-to-learning path, refresh, recovery and normal/reduced motion. Source-panel assertions include visible support labels. A 360px Reel overflow was caught and its spacing corrected while retaining the 9:16 frame.

An intermediate full run had one aborted page navigation while editing continued. The final run with editing paused passed all 47 cases, including that same 390px journey. All six interaction screenshots, completion, educational card and health Reel were visually inspected. Screenshots remain in ignored `test-results/`; each browser run resets the folder.

Build output: initial JavaScript approximately 144.5 kB gzipped, initial CSS 9.4 kB, GLP-1 experience chunk 5.24 kB, shared question data 4.68 kB, source UI 0.85 kB and route CSS 2.53 kB. No dependencies added. Question data is shared with the lazy-loaded judge preview and health Reel.

Verified new references: NIDDK's prescription-treatment overview; MedlinePlus/ASHP semaglutide injection information as one medicine-specific safety example; the accessible journal PDF of the 2025 joint nutrition/GLP-1 advisory; and the STEP 1 withdrawal extension on the publisher's website. Existing NIDDK GLP-1 and appetite references are reused. Each topic shows what a reference supports and where it cannot be generalised. A blocked PMC full-text page was not used as the verified full-text reference. The withdrawal study's funding and subgroup/withdrawal limitations are disclosed. US references do not establish approvals in India.

All new medical wording remains **pending qualified clinical review**. No eligibility assessment, medicine brand promotion, medical-history input, dosing guidance or treatment recommendation is provided. The two planning paths are conceptual illustrations, not comparative trial results or predictions. Lean tissue is distinguished from muscle and physical function.

The 30–60-second label is a design target; real-user comprehension and timing have not been measured. Tests use Edge with mobile viewports rather than physical iOS/Android devices. Native share API paths use stubs; actual OS share sheets remain unverified. Cards share text and links, without raster export. Public hosting, social previews, official brand assets and clinical approval remain pending. Localhost links need a reachable origin to share elsewhere. The existing dev server remains running for review.

Recommended Phase 6: clinical and local regulatory-reference review, consenting-adult comprehension/timing checks, physical-device accessibility and sharing checks, approved brand assets, public hosting and social previews.

## Phase 4 validation record

Verified locally on 18 October 2026.

| Check | Result |
| --- | --- |
| Baseline before Phase 4 | 69 unit/integration tests, 31 browser tests and production build passed |
| `npm run build` | Pass; strict TypeScript checks and Vite production build |
| `npm test` | 88 unit/integration tests passed across seven files |
| `npm run test:e2e` | Full suite of 39 Microsoft Edge browser tests passed |
| Final targeted regression | Eight metabolism browser tests passed again after the final keyboard-focus and content-clarity adjustments |
| Existing games | All five entertainment experiences and existing ad routes retained; previous 31 browser tests passed |
| Mobile layout | Metabolism Quick Play and all seven independent chapters exercised at 360, 390 and 430px; no horizontal overflow |
| Entry routes | Discovery, judge preview, `/learn/metabolism`, legacy `/play/inside-metabolism`, direct chapter/card URLs and refresh tested |
| Opening | Immediate lunch challenge; correct and incorrect choices both explain digestion and allow progression |
| Digestion | Mouth, stomach and small intestine unlock in order; previously explored structures remain revisitable |
| Glucose | Wrong ordering gives feedback and permits correction; connected cards visibly move into order; keyboard focus advances to the next available action |
| Gut and brain | Signal remains clickable with motion; explanation and several-processes knowledge prompt required before continuing |
| GLP-1 | Interactive gut, pancreas and brain relationships; glucose-dependent insulin action and optional neutral treatment note accessible |
| Knowledge check | Correct and incorrect responses teach the same interconnected-systems takeaway and allow completion |
| Completion | Shared ScienceReveal and GameCompletionScreen; working Steer URL, deeper learning, knowledge card, replay and discovery return |
| Deeper learning | Seven independent chapters; interactive topics, optional detail, sources, chapter navigation and library return |
| Replay | Choices, explored structures, card order and completion reset; returning from deeper learning preserves the current in-memory playthrough |
| Content records | 31 unique lesson IDs; explanations, caveats, real source IDs, verification status and pending clinical review metadata |
| References | NIDDK digestion, glucose/insulin, GLP-1 research and gut-brain references plus MedlinePlus metabolism; visible sources and caveats |
| Knowledge card | Fixed educational text, review notice, branding and public learning link; no personal data or score |
| Sharing | Native success, clipboard and manual fallback covered; public title, text and URL only; cancellation not counted as success |
| Events | Strict Mode-safe milestones; event name and game identifier only, bounded memory buffer, no answers or network payload |
| Accessibility | Native controls, labelled simplified diagrams, large targets, live feedback, guarded repeated submissions and stage focus |
| Motion | Complete flow exercised with regular and reduced motion; reduced-motion connector animation disabled |
| Errors | New browser flows report no JavaScript errors; invalid view/chapter queries recover with usable navigation |
| Availability | Six experiences enabled; only GLP-1, Explained remains planned |
| Authentication | No account, credential fields, backend or runtime medical assistant |
| HTTP readiness | Local dev server remains available on port 5173 |

Initial JavaScript is approximately 144 kB gzipped and initial CSS approximately 9.4 kB gzipped. The route-loaded metabolism chunk is approximately 11.7 kB gzipped, plus approximately 3.3 kB of route CSS. Existing lazy loading remains in place. No dependencies were added in Phase 4. Fonts load externally with local fallbacks.

Browser screenshots are generated in ignored `test-results/`. The metabolism opening, digestion, glucose, GLP-1, completion and knowledge-card screens were visually inspected at 390px. Connected glucose cards now move into their correct visual order, and the educational card contains its own pending-review notice. Each browser run resets that directory, so a filtered run retains only its own screenshots.

## Retained earlier coverage

The existing suite covers all five quiz interests, deterministic question selection, invalid interest/seed handling, correct and incorrect answers, science reveals, source links, replay, optional sharing and Steer CTA destinations. It also covers all four Predict the Twist scenarios, Signal Rush's three rounds and seeded patterns, the Case File's three required clues, entertainment lifecycle events and 9:16 Reel previews at the requested widths. Earlier desktop layout and keyboard checks remain documented by the existing tests.

## Verification limits

All medical explanations remain **pending qualified clinical review**. Reference verification confirms accessible supporting sources, not clinical approval of the application copy. The GLP-1 lesson distinguishes the natural hormone from prescription receptor agonists; no branded medicine or treatment suitability is promoted. Game mechanics are simplified educational illustrations, not physiological simulations or medical assessments.

The 40–60-second Quick Play label is a design target. Real-user reading time, educational comprehension and engagement have not been measured. Automated completion does not establish typical human completion time.

The OS-native share sheet is outside browser automation. Its API path is tested with stubs; clipboard and visible URL fallbacks are tested. Physical iOS/Android sharing and device testing remain pending. Automated tests use desktop Edge with mobile viewport sizes.

Sharing uses the current origin. Localhost links need a publicly hosted or reachable LAN origin for use on another device. The card shares text and a link; it does not export a raster image. Vercel SPA rewrites are configured, but public hosting and social preview metadata have not been validated.

The supplied palette is retained. An official vector wordmark was not supplied or found during earlier inspection; the typeset approximation needs brand approval. Programme wording also needs Steer's approval before publication.

Progress and local events are memory-only and reset on refresh. No physical-device validation, public deployment, real Meta integration or live analytics collection was performed. Phase 5 should prioritise clinical approval and usability timing, then the remaining GLP-1, Explained experience, official brand assets and a hosted mobile-sharing check.
