import test from "node:test";
import assert from "node:assert/strict";
import { analyzeResponse, computeVisibility, generateActions, scorePrompt } from "../src/index.js";

const project = { id: "p1", brandName: "Acme", domain: "acme.test", competitors: [{ id: "b2", name: "Rival" }] };
const brand = { id: "b1", name: "Acme", domain: "acme.test" };
const competitors = [{ id: "b2", name: "Rival" }];

test("analyzes mentions and owned citations", () => {
  const analysis = analyzeResponse({ answer: "Acme is best; Rival is second.", brand, competitors, citations: ["https://acme.test/a", "https://review.test/b"] });
  assert.equal(analysis.ownBrandMentioned, true);
  assert.equal(analysis.ownBrandRank, 1);
  assert.equal(analysis.ownedCitationCount, 1);
});

test("computes visibility metrics", () => {
  const responses = [
    { analysis: analyzeResponse({ answer: "Acme and Rival", brand, competitors, citations: ["https://acme.test/a"] }) },
    { analysis: analyzeResponse({ answer: "Rival only", brand, competitors, citations: ["https://review.test/b"] }) }
  ];
  const metrics = computeVisibility(responses, "b1");
  assert.equal(metrics.visibility, 50);
  assert.equal(metrics.citationShare, 50);
});

test("generates evidence-backed action for competitor wins", () => {
  const analysis = analyzeResponse({ answer: "Rival wins", brand, competitors, citations: ["https://review.test/b"] });
  const actions = generateActions({ project, prompts: [{ id: "prompt3", text: "best tool", commercialIntent: 5, volume: 4, strategicFit: 5 }], responses: [{ id: "r1", promptId: "prompt3", analysis }] });
  assert.equal(actions.length, 1);
  assert.equal(actions[0].priority, "high");
  assert.deepEqual(actions[0].evidence.competitorNames, ["Rival"]);
});

test("prompt score is bounded", () => {
  assert.equal(scorePrompt({ commercialIntent: 5, volume: 5, strategicFit: 5 }), 100);
  assert.ok(scorePrompt({ commercialIntent: 1, volume: 1, strategicFit: 1 }) >= 20);
});
