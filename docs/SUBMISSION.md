# Steer Play

**Project:** Steer Play  
**Problem Statement:** PS1 — The Ad People Want to Tap

**Trigger:** An interest-matched, three-second challenge encourages viewers to stop scrolling and interact. Three seconds is a creative design target, not a measured result.

**Value:** Each playable experience offers an engaging reveal and a scientifically grounded insight about metabolic health. Content is educational and pending clinical review.

**Next Step:** Users can voluntarily explore Steer's doctor-led programme or share the experience with friends. No consultation, account or sharing is required to finish.

## Try the prototype

Run `npm ci`, then `npm run dev`. Open the printed URL, visit `/demo` and choose **Start Guided Demo**. Judges can switch seven illustrative audiences, compare creative openings, scroll a five-item fictional Reels feed, launch real games, share a public challenge and follow the optional Steer handoff. Return-to-demo links preserve the demonstration context without adding it to shared game URLs.

**Deployment link:** [TO BE ADDED AFTER AUTHORIZED DEPLOYMENT]  
**Loom link:** [TO BE ADDED AFTER RECORDING]

## Technology

React 19, TypeScript 7, Vite 8, Tailwind CSS 4, Motion for React, React Router and Lucide React. Original lightweight SVG artwork; warm Steer palette, serif headings and sans-serif body text. Vitest, Testing Library and Playwright provide automated checks. Static frontend; no backend, login, database, runtime AI or external analytics service. Game progress and prototype event records stay in memory.

## Seven experiences

| Game | What the player does | Useful discovery |
| --- | --- | --- |
| Find What Everyone Missed | Remember a breakfast table and spot the missing object | A visual analogy introduces invisible gut–brain signals |
| Steer Play Quiz | Answer three interest questions, a science bridge and a GLP-1 discovery | A familiar interest opens a qualified appetite explanation |
| Predict the Twist | Make two predictions in an illustrated adult story | Several influences and individual context matter |
| Signal Rush | Match, remember and focus on symbols in three untimed rounds | Signalling is a communication analogy, not a health test |
| The Case File | Inspect three clues and make an evidence-based deduction | One clue cannot establish a medical explanation |
| Inside Your Metabolism | Explore organs, order a glucose sequence and follow signals | Digestion, energy use and appetite involve connected systems |
| GLP-1, Explained | Pick one of six questions, answer and explore an explanation | Natural hormone biology, treatment limitations and clinical assessment remain distinct |

## Personalization and creative testing

Seven explicitly selected profiles cover food, gaming, entertainment, puzzles, everyday lifestyle, science and metabolic-health education. They change organic illustrations, sponsored hooks, destinations and relevant quiz/story configuration. Quiz questions are reproducible from a public interest and seed. Story links preserve the selected scenario. No Instagram watch history, real Meta targeting or sensitive profile is accessed.

The five entertainment creatives each have an original opening plus **two selectable alternatives**. Judge Mode carries the opening into the actual simulated Reel. These are untested hypotheses; no winner, engagement lift or campaign result is claimed.

## Sharing

Native Web Share is attempted first, followed by clipboard and a selectable URL fallback. Entertainment links carry only the public game variation. A fresh browser can play without login. Educational cards share fixed explanations or library pages, without personal answers, scores or medical information. The interface explains the shared content before the user chooses to share. Localhost links require a reachable LAN or hosted origin for another device.

## Scientific references and approval

The exact-copy inventory, individual source mappings, corrections and source limitations are in [SCIENCE_REVIEW.md](SCIENCE_REVIEW.md). References include NIDDK digestion/glucose/GLP-1 and treatment education, NHLBI sleep/assessment/heart education, MedlinePlus metabolism/cell biology and medicine-specific information, the 2025 joint nutrition advisory, and the 2022 STEP 1 extension. Those sources support educational concepts; they do not endorse this application or establish medicine approval in India.

**Clinical approval: pending.** Medical content, illustrations, answer corrections and share cards need qualified clinician approval. Steer's programme description was compared with its [official public website](https://steerclub.com/); the exact paraphrase and typeset mark still need brand approval. No medication promotion, diagnosis, medical eligibility score or outcome promise is provided.

## Validation and limits

See [FINAL_AUDIT.md](FINAL_AUDIT.md) for executed tests, mobile coverage, performance measurements and deployment steps. Simulated mobile checks are not physical-device testing. Lighthouse scores, native OS share sheets and hosted behaviour remain unverified where stated. Reading time, educational comprehension, real-user hook performance and campaign metrics have not been measured.

## AI tools used

OpenAI Codex assisted with implementation, refactoring, copy auditing, tests and documentation. Connected web tools were used to inspect primary references and official Steer/Vercel information. No AI runs inside the application, generates medical advice at runtime or supplies a simulated clinical approval. No separate AI image-generation service was used for this phase; artwork remains code-native SVG.
