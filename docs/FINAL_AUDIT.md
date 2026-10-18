# Steer Play — final product audit

Audit date: 18 October 2026. Phase 7 retains all seven games and the existing frontend architecture. This is a prototype, with simulated audience selection and advertising. Nothing was pushed, published or deployed.

## Verified baseline

Read the project guidance, README, historical validation records, package/configuration files, game components and logic, scientific records, campaign data, routes, shared reveal/completion/sharing components and existing tests. Historical Phase 4/5 statements in VALIDATION.md describe those phases, not current availability.

Before implementation: **122 unit/integration tests passed across 11 files; 56 browser tests passed; zero failures and zero skipped tests; TypeScript and production build passed.** Baseline browser run completed in 4.3 minutes. The seven reported experiences are implemented, not placeholders.

## Feature audit

| Feature | Current implementation status | UX quality issues found | Functional issues found | Improvement / remaining recommendation | Priority |
| --- | --- | --- | --- | --- | --- |
| Discovery hub | Seven complete experiences; editorial cards and brand palette | First-load font stylesheet blocked rendering when external access failed | No broken game entry found | Font loading made optional and non-blocking; quiz module now route-loaded | P1 fixed |
| Judge demo | Studio, audience comparison, HTML5 preview and sharing loop retained | Long page had no guided start or short interactive path | Games had no explicit return to the originating demo; the guide also needed context preserved through feed URL changes | Added five-step Start Guided Demo, persistent URL step/audience/creative and return links using in-memory navigation context; scrolling and creative changes preserve the correct guide step and shared game | P1 fixed |
| Five entertainment ad hooks | Original plus two alternatives each; same game engines | Only one opening per creative; hypotheses could not be compared | No variant parameter | Added ten alternatives and native selector; Reel and campaign URL carry the hook choice; no performance ranking | P1 fixed |
| Seven first frames | Clear focal artwork, sound-off challenge and real CTA | At 320×568 the quiz ad artwork collapsed to zero height; 375×667 clipped it | Challenge could be visually missing despite a working CTA | Keep a legible minimum frame; compact small-container spacing and permit outer-page scroll on short phones | P1 fixed |
| Missing Clue | Observe, remember, choose a missing object, reveal, completion | Broad appetite context had only digestion reference | No broken state transition found | Added accessible optional appetite/sleep references; retained clear wrong-answer correction | P2 fixed |
| Adaptive Quiz | Three seeded interest questions, one relevant science bridge, one GLP-1 discovery | Biology trivia answers lacked displayed sources | Sources rendered only for bridge/discovery kinds | Added heart/cell citations and review labels; result has optional context references | P1 fixed |
| Predict the Twist | Two illustrated story predictions; four adult fictional scenarios | The afternoon/lunch opening conflicted with dinner and brunch variants; timing remains unmeasured | No broken scenario/replay found | Made the headline and campaign artwork meal-neutral across scenarios; retained uncertainty and contextual science | P2 review complete |
| Signal Rush | Three distinct symbol, memory and focus rounds; no timer | Legacy heading implied a changing target despite untimed play | No broken seed/replay found | Removed the unsupported timing implication; retained analogy limitations and reduced motion | P2 review complete |
| Case File | Three required clue inspections, deduction and contextual reveal | Programme statement needed business source attribution | No broken clue gate found | Added official public Steer reference; no clinical inference from fictional clues | P2 fixed |
| Inside Your Metabolism | Ordered organ exploration, glucose sequence, signal exploration, knowledge check, seven optional chapters | Carbohydrate sentence could include fibre; learning share described as a challenge | No broken completion found | Qualified digestible carbohydrate, expanded treatment references and corrected learning-share semantics | P1 fixed |
| GLP-1, Explained | Six independent topics, corrective answer, interactive visual, optional detail and public learning cards | Essential caveats must remain visible; no eligibility inference | No broken topic/visual/completion found | Retained medicine-specific, lean mass/function, withdrawal-study and jurisdiction limitations | P1 review complete |
| Seven audience profiles | Explicit demo selection changes feed, creative artwork and game configuration | Must remain clearly simulated | No stale destination on profile switch found | Seven profiles and five quiz interests covered; alternatives remain interest-labelled | P1 verified |
| Sharing / fresh recipient | Web Share, clipboard and manual URL fallback; no login | Previously unclear what leaves the game | Metabolism learning card used challenge terminology | Added pre-share explanation and learning labels; fresh-context links contain public variation only | P1 fixed |
| Completion / Steer handoff | Optional external link, replay, more games and sharing in all seven | Programme descriptions differed across games | No incorrect external destination found | Centralised description checked against public Steer site; exact brand approval remains pending | P1 fixed |
| Mobile / accessibility | Native controls, visible focus, stage feedback, reduced motion and skip link | New source controls needed 44px sizing; missing safe-area opt-in | No initial-route overflow at six widths | Enlarged controls, added viewport-fit and safe-area spacing; expanded touch-flow checks | P1 fixed |
| Performance | Route chunks, inline SVG and only active Reel animation; source scanning restricted to app files | Blocking remote fonts; quiz loaded on initial hub | Lighthouse package unavailable | Removed blocking font import and hub entrance animation, route-loaded quiz, kept Motion out of the hub entry and excluded audit documents from Tailwind scans; measured cold throttled production preview | P1 improved; targets partly open |
| Deployment | Static production bundle and SPA rewrite configuration | Hosted sharing/social previews unverified | No hosted environment exercised | Production assets and local deep links checked; retain deployment instructions and placeholders | P1 prepared, not deployed |

## First three seconds

| Creative | Focal point / immediate action | Sound-off opening review |
| --- | --- | --- |
| Missing Clue | Breakfast-table change; Spot the clue | Original and two alternatives invite observation; visual preview is labelled |
| Quiz | Actual seeded first question; Take the challenge | Interest headline plus answer preview; alternatives retain interest name |
| Predict the Twist | Two fictional characters; Make your prediction | Short prediction invitation matches the actual scenario |
| Signal Rush | Target and three symbols; Take the challenge | Pattern is immediately visible; alternative explicitly says untimed |
| Case File | Three illustrated evidence cards; Solve the case | Clear three-clue invitation; alternative asks what evidence supports |
| Metabolism | Meal-to-organ diagram; Follow the science | One question about after lunch; essential review label retained |
| GLP-1 | Fact/fiction proposition; Explore the facts | Natural hormone statement opens education; no prescription promotion |

All seven use actual working links, no audio dependency, no fake urgency/statistics, and no claims of measured engagement. Preview artwork is labelled; decorative answer previews do not pretend to be clickable game controls. Only the active Reel animates. Hypotheses need real user testing before selecting a winner.

## Personalization and game mechanics

| Explicit audience | Relevant creative destinations | Configuration |
| --- | --- | --- |
| Food & Cooking | Quiz, Predict, Missing Clue | Food trivia; office story; kitchen organic artwork |
| Gaming & Challenges | Signal Rush, Quiz | Public seeded patterns; gaming trivia |
| Entertainment & Storytelling | Predict, Case File, Quiz | Family story; entertainment trivia |
| Puzzles & Mysteries | Missing Clue, Case File, Signal Rush | Visual memory; evidence; seeded patterns |
| Everyday Lifestyle | Predict, Quiz, Case File | Weekend story; lifestyle trivia |
| Science & Curiosity | Metabolism, Quiz, GLP-1 | Interactive biology; science trivia |
| Metabolic Health & GLP-1 Education | GLP-1, Metabolism | Voluntarily selected education; no condition inferred |

The quiz draws three distinct seeded candidates from the selected interest, then its corresponding bridge and the shared GLP-1 discovery. Incorrect answers teach rather than block. The five entertainment mechanics remain observation, trivia, prediction, symbol/memory matching and evidence investigation; the science journeys add ordered diagrams and question-led interactive explanations. No game was replaced or duplicated.

## Final validation and measurements

Final executed counts and measured performance are recorded below. Evidence is in `docs/evidence/`; the scientific inventory and remaining approvals are in `SCIENCE_REVIEW.md`.

Mobile automation uses headless Microsoft Edge, touch-capable mobile contexts at **320, 360, 375, 390, 414 and 430px**, plus existing desktop/keyboard coverage. All seven campaign launches are taken through completion, feedback, reveal, optional Steer link, sharing, replay and a fresh recipient context. Additional checks cover seven profiles, ten hook alternatives, invalid parameters, native scrolling, browser history and reduced motion. Short 568/667px screens receive a separate first-frame clipping check; their outer page can scroll so artwork retains a readable size. No custom modal is used; OS share-sheet behaviour is outside simulated-browser coverage. Safe-area CSS is implemented; physical notches and OS share sheets remain untested.

## Deployment preparation

The app is a static Vite SPA. `vercel.json` rewrites application paths to `/index.html`, preserving asset paths. Compare with [Vercel's SPA guidance](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). Local production-preview deep-link checks validate the bundle; they do not exercise Vercel's routing infrastructure.

After explicit authorization to publish:

1. Place this project in the intended Git repository and connect it to the intended Vercel account, or use an authenticated Vercel CLI from this directory.
2. Choose framework **Vite**, root this project directory, Node **22.x**, install `npm ci`, build `npm run build`, output **dist**. No environment variables or backend credentials are needed.
3. Retain `vercel.json`; deploy a preview first. Do not add secrets as `VITE_*` variables, which become public client code.
4. On the real preview origin refresh `/c/quiz?profile=food&seed=reel-demo`, `/play/signal-rush?seed=reel-demo`, `/learn/metabolism?view=share`, `/learn/glp1?topic=works&view=library` and `/demo/reels?profile=food&reel=2`.
5. Check JS/CSS/SVG requests, real iOS/Android safe areas, OS sharing, fresh-device public links, keyboard focus, external Steer links and social previews. Run hosted Lighthouse. Then seek explicit authorization for public promotion.

No deployment command, push or publication was run. Deployment and Loom URLs remain placeholders in SUBMISSION.md.

## Remaining approval and validation work

- Qualified clinical approval of exact copy, diagrams, answer feedback, caveats and public learning cards; record reviewer/date/version.
- Steer approval of programme paraphrase and typeset logo. Public-source alignment is not approval.
- Physical iOS/Android and native share-sheet testing, hosted link/social-preview checks and hosted Lighthouse scores.
- Real-user opening-hook comprehension, learning value and completion timing. No campaign performance or growth claim is supported yet.

These limit public medical/campaign readiness; the local interactive hackathon demonstration remains usable with its prototype and pending-review labels.

## Production performance evidence

Measured on the local production candidate after the functional, mobile and loading changes in headless Edge: cold contexts, cache disabled, 390 x 844 touch viewport, 4x CPU slowdown, 150ms latency, 200,000 bytes/s download and 93,750 bytes/s upload. Three runs per route, each observed for five seconds after the heading appears. All raw samples and bundle sizes are retained in [performance.json](evidence/performance.json). These are browser observer measurements, not Lighthouse or field results. The subsequent meal-neutral story copy, untimed Signal Rush heading and guided-return corrections were covered by separate affected-flow checks; raw bundle filenames refer to the measured candidate.

| Route | LCP median | LCP range | Maximum observed CLS | Median LCP <=2.5s? |
| --- | --- | --- | --- | --- |
| / | 1.776s | 1.524 to 2.180s | 0.0000 | Yes |
| /demo?guided=1 | 5.856s | 2.668 to 6.524s | 0.0474 | No |
| /demo/reels?profile=food&reel=2 | 4.508s | 1.840 to 5.116s | 0.0474 | No |
| /play/quiz?interest=food&seed=reel-demo | 2.008s | 1.888 to 2.288s | 0.0474 | Yes |
| /learn/metabolism | 2.076s | 2.044 to 2.456s | 0.0474 | Yes |
| /learn/glp1 | 2.244s | 1.996 to 2.488s | 0.0474 | Yes |

The 90+ mobile performance and 95+ accessibility score targets are **unverified**: Lighthouse was not installed, and its npm download failed with EACCES in the restricted environment. CLS stayed under 0.1 in these samples. Some LCP samples and route medians exceed 2.5s; the full mobile loading target is therefore **not yet demonstrated**. The 18 samples show substantial timing variation. Repeat hosted Lighthouse/profiling before treating the target as achieved.

Google Fonts requests were denied in this environment; measurements use system fallback fonts. Their stylesheet is now optional and non-blocking. Repeat layout-stability checks with fonts successfully loaded on real devices. Before the font fix, a preliminary single run observed 5.340 to 7.124s LCP across these routes; this is retained in [before-font evidence](evidence/performance-before-font-fix.json), and is not a controlled statistical comparison.

The main entry chunk decreased from 126.99kB to approximately 74.20kB gzipped (about 42% smaller). Shared chunks are additional; route-level game chunks remain separate. Initial CSS is approximately 9.64kB gzipped. No dependencies were added. SVG artwork has stable containers; inactive Reels pause their animations. All seven finished campaign entries load on the production preview, with no page errors or failed local assets; five repeated Missing Clue share/fresh-recipient/replay cycles also passed, recorded in [production smoke evidence](evidence/production-smoke.json). These smoke checks are separate from the automated-suite totals.

## Executed final checks

| Check | Total | Passed | Failed | Skipped |
| --- | --- | --- | --- | --- |
| Unit/integration, final source (11 files) | 122 | 122 | 0 | 0 |
| Complete Phase 7 browser suite | 64 | 64 | 0 | 0 |
| Final affected browser rerun after copy/navigation fixes | 17 | 17 | 0 | 0 |

**186 unique suite cases** were validated. The table records **203 executions**, including the 17 repeated affected cases. TypeScript and Vite production build passed on the final source. No retries were configured. Summary records: [all checks](evidence/test-summary.json), [full browser run](evidence/e2e-full-summary.json), [final affected run](evidence/e2e-navigation-final-summary.json).

The 64-case full run preceded the last meal/timer copy and guided-return refinements. All affected campaign and refinement cases were rerun afterwards (17 passed). The legacy entertainment copy checks also passed in an intermediate run intentionally stopped after 21 completed passes to correct the guided navigation gap. Those interrupted executions are not represented as a completed passing suite.

An earlier full run had one 430px replay timeout (63 passed, 1 failed). It did not recur in the unchanged-source 64-case run, the final affected run, or five production replay diagnostics. Documentation/build activity and a stylesheet update occurred during that earlier dev-server run; this does not prove the cause. That result remains in [intermediate summary](evidence/e2e-intermediate-summary.json). Failure tracing is enabled for the new touch tests, and Tailwind scans application sources rather than audit documents.

Final navigation correction: scrolling could lose the guided return target when feed query parameters were replaced. Selecting a different creative could then make the guide offer an earlier game for sharing. Reels now preserve navigation state; game launch records the actual public audience/creative, and the guide resolves the matching share link. Generic demo returns are labelled separately from guided returns. The regression exercises this path with the Case File.

The final rebuilt bundle was also checked over HTTP after the last navigation changes: all 48 generated assets and 10 application/deep-link URLs returned successfully. The development server on port 5173 returned HTTP 200 and remains running. See [final build HTTP evidence](evidence/final-build-http.json). The final limited secret-pattern scan covered 174 text assets/source/documents with zero matching findings; no root environment files were present. This is not a comprehensive security certification. Vercel route rules passed the local path/asset checks. No deployment or push occurred.
