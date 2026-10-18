import { describe, expect, it } from 'vitest';
import { createPredictionState, choosePrediction, advancePrediction, predictionIsSupported } from '../games/PredictTheTwist/predictionLogic';
import { predictionScenarios, resolveScenario, scenarioIds } from '../games/PredictTheTwist/scenarios';
import { generateSignalPatterns, symbolNames } from '../games/SignalRush/signalPatterns';
import { createSignalState, chooseSignal, advanceSignal, togglePattern, validateSignalAnswer } from '../games/SignalRush/signalLogic';
import { createCaseState, inspectClue, advanceCase, chooseDeduction } from '../games/CaseFile/caseLogic';
import { gameScience } from '../data/gameScienceContent';
import { scienceSources } from '../data/scientificContent';

describe('prediction stories and progression', () => {
  it.each(scenarioIds)('loads a distinct adult scenario: %s', id => {
    expect(resolveScenario(id)).toBe(id);
    const scenario = predictionScenarios[id];
    expect(scenario.choices).toHaveLength(3);
    expect(scenario.endings).toHaveLength(2);
    expect(scenario.scene).not.toBe('');
    expect(scenario.followup).not.toBe('');
    expect(scenario.people.every(person => /, [2-9]\d/.test(person))).toBe(true);
  });
  it('falls back safely and keeps scenario copy distinct', () => {
    expect(resolveScenario(null)).toBe('office');
    expect(resolveScenario('<script>')).toBe('office');
    expect(new Set(Object.values(predictionScenarios).map(s => s.scene)).size).toBe(4);
  });
  it('locks one choice per scene, guards Next and permits unsupported predictions', () => {
    const state = createPredictionState();
    expect(advancePrediction(state)).toBe(state);
    expect(choosePrediction(state, -1)).toBe(state);
    expect(choosePrediction(state, 3)).toBe(state);
    expect(choosePrediction(state, .5)).toBe(state);
    const first = choosePrediction(state, 0);
    expect(choosePrediction(first, 1)).toBe(first);
    const second = advancePrediction(first);
    expect(second.stage).toBe('second');
    expect(choosePrediction(second, 2)).toBe(second);
    expect(advancePrediction(second)).toBe(second);
    const science = advancePrediction(choosePrediction(second, 0));
    expect(science.stage).toBe('science');
    const complete = advancePrediction(science);
    expect(complete.stage).toBe('complete');
    expect(advancePrediction(complete)).toBe(complete);
    expect(choosePrediction(complete, 1)).toBe(complete);
    expect(predictionIsSupported(1)).toBe(true);
    expect(predictionIsSupported(0)).toBe(false);
    expect(createPredictionState().answers).toEqual([null, null]);
  });
});

describe('deterministic signal challenge', () => {
  it('generates reproducible, valid match/memory/focus rounds with varied seeds', () => {
    expect(generateSignalPatterns('demo123')).toEqual(generateSignalPatterns('demo123'));
    const sets = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const rounds = generateSignalPatterns(`seed${i}`);
      sets.add(JSON.stringify(rounds));
      expect(rounds.map(r => r.id)).toEqual(['match', 'memory', 'focus']);
      for (const round of rounds) {
        expect(round.options).toHaveLength(3);
        expect(new Set(round.options).size).toBe(3);
        expect(round.options.filter(option => option === round.target)).toHaveLength(1);
        expect(symbolNames).toContain(round.target);
        expect(round.options.filter((_, index) => validateSignalAnswer(round, index))).toHaveLength(1);
      }
      expect(rounds[1].sequence![1]).toBe(rounds[1].target);
      expect(rounds[1].sequence![0]).not.toBe(rounds[1].target);
    }
    expect(sets.size).toBeGreaterThan(1);
  });
  it('requires observation before memory answers, locks submissions and resets on replay', () => {
    const rounds = generateSignalPatterns('steer');
    let state = createSignalState();
    expect(advanceSignal(state)).toBe(state);
    expect(togglePattern(state)).toBe(state);
    expect(chooseSignal(state, 3, rounds)).toBe(state);
    expect(chooseSignal(state, .2, rounds)).toBe(state);
    state = chooseSignal(state, 0, rounds);
    expect(chooseSignal(state, 1, rounds)).toBe(state);
    state = advanceSignal(state);
    expect(state.round).toBe(1);
    expect(chooseSignal(state, 0, rounds)).toBe(state);
    state = togglePattern(state);
    expect(state.memoryVisible).toBe(false);
    state = togglePattern(state);
    expect(state.memoryVisible).toBe(true);
    state = chooseSignal(togglePattern(state), 0, rounds);
    expect(togglePattern(state)).toBe(state);
    state = advanceSignal(state);
    state = advanceSignal(chooseSignal(state, 0, rounds));
    expect(state.stage).toBe('science');
    expect(chooseSignal(state, 1, rounds)).toBe(state);
    expect(advanceSignal(state).stage).toBe('complete');
    expect(createSignalState()).toEqual({ stage: 'play', round: 0, answers: [null, null, null], memoryVisible: true });
  });
});

describe('case investigation', () => {
  it('requires inspecting every clue, retains visited clues after collapsing, and guards deduction', () => {
    let state = createCaseState();
    expect(advanceCase(state)).toBe(state);
    expect(inspectClue(state, -1)).toBe(state);
    expect(inspectClue(state, 3)).toBe(state);
    expect(chooseDeduction(state, 1)).toBe(state);
    state = inspectClue(inspectClue(state, 0), 0);
    expect(state.inspected[0]).toBe(true);
    expect(state.expanded[0]).toBe(false);
    expect(advanceCase(state)).toBe(state);
    state = advanceCase(inspectClue(inspectClue(state, 1), 2));
    expect(state.stage).toBe('deduction');
    expect(advanceCase(state)).toBe(state);
    expect(inspectClue(state, 0)).toBe(state);
    expect(chooseDeduction(state, 3)).toBe(state);
    state = chooseDeduction(state, 0);
    expect(chooseDeduction(state, 1)).toBe(state);
    expect(advanceCase(state).stage).toBe('science');
    expect(advanceCase(advanceCase(state)).stage).toBe('complete');
    expect(createCaseState().inspected).toEqual([false, false, false]);
  });
});

describe('clinical traceability', () => {
  it('assigns a stable ID, sources, limitations and pending review to every new health explanation', () => {
    const articles = Object.values(gameScience);
    expect(new Set(articles.map(a => a.id)).size).toBe(articles.length);
    for (const article of articles) {
      expect(article.id).toMatch(/-v1$/);
      expect(article.statement.length).toBeGreaterThan(15);
      expect(article.limitation.length).toBeGreaterThan(15);
      expect(article.reviewStatus).toBe('pending');
      expect(article.sourceIds.length).toBeGreaterThan(0);
      for (const id of article.sourceIds) {
        // Business description is sourced separately from the medical references.
        if (id === 'steerProgramme') expect(scienceSources[id].url).toBe('https://steerclub.com/');
        else expect(scienceSources[id].url).toMatch(/^https:\/\/(www\.)?(niddk|nhlbi)\.nih\.gov\//);
      }
    }
  });
});
