export const PROVIDERS = ["chatgpt", "gemini", "perplexity", "google-ai-mode", "google-ai-overview"];

const normalize = (value = "") => String(value).trim().toLowerCase();
const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
};

export function extractBrandMentions(answer, brands) {
  const haystack = normalize(answer);
  return brands
    .map((brand) => ({ ...brand, mentioned: haystack.includes(normalize(brand.name)) }))
    .filter((brand) => brand.mentioned);
}

export function extractCitation(url, ownDomain) {
  const domain = hostOf(url);
  return { url, domain, isOwned: domain === ownDomain || domain.endsWith(`.${ownDomain}`) };
}

export function analyzeResponse({ answer, brand, competitors = [], citations = [] }) {
  const entities = [{ id: brand.id, name: brand.name, type: "own" }, ...competitors.map((c) => ({ ...c, type: "competitor" }))];
  const mentions = extractBrandMentions(answer, entities);
  const lower = normalize(answer);
  const ordered = mentions
    .map((m) => ({ ...m, position: lower.indexOf(normalize(m.name)) }))
    .sort((a, b) => a.position - b.position)
    .map((m, index) => ({ ...m, rank: index + 1 }));

  const ownMention = ordered.find((m) => m.type === "own");
  const competitorMentions = ordered.filter((m) => m.type === "competitor");
  const parsedCitations = citations.map((url) => extractCitation(url, brand.domain));

  return {
    ownBrandMentioned: Boolean(ownMention),
    ownBrandRank: ownMention?.rank ?? null,
    mentions: ordered,
    competitorMentions,
    citations: parsedCitations,
    ownedCitationCount: parsedCitations.filter((c) => c.isOwned).length,
    citationCount: parsedCitations.length
  };
}

export function computeVisibility(responses, ownBrandId) {
  if (!responses.length) return { visibility: 0, shareOfVoice: 0, citationShare: 0, firstPositionRate: 0 };
  const withBrand = responses.filter((r) => r.analysis?.ownBrandMentioned).length;
  const allMentions = responses.flatMap((r) => r.analysis?.mentions ?? []);
  const ownMentions = allMentions.filter((m) => m.id === ownBrandId).length;
  const allCitations = responses.flatMap((r) => r.analysis?.citations ?? []);
  const ownCitations = allCitations.filter((c) => c.isOwned).length;
  const first = responses.filter((r) => r.analysis?.ownBrandRank === 1).length;

  return {
    visibility: Math.round((withBrand / responses.length) * 1000) / 10,
    shareOfVoice: allMentions.length ? Math.round((ownMentions / allMentions.length) * 1000) / 10 : 0,
    citationShare: allCitations.length ? Math.round((ownCitations / allCitations.length) * 1000) / 10 : 0,
    firstPositionRate: Math.round((first / responses.length) * 1000) / 10
  };
}

export function scorePrompt({ commercialIntent = 3, volume = 3, strategicFit = 3 }) {
  const clamp = (n) => Math.max(1, Math.min(5, Number(n) || 1));
  return Math.round(((clamp(commercialIntent) * 0.45 + clamp(volume) * 0.35 + clamp(strategicFit) * 0.20) / 5) * 100);
}

export function generateActions({ project, prompts, responses }) {
  const responseByPrompt = new Map();
  for (const response of responses) {
    const current = responseByPrompt.get(response.promptId) ?? [];
    current.push(response);
    responseByPrompt.set(response.promptId, current);
  }

  return prompts.flatMap((prompt) => {
    const runs = responseByPrompt.get(prompt.id) ?? [];
    if (!runs.length) return [];
    const brandMisses = runs.filter((r) => !r.analysis?.ownBrandMentioned);
    const competitorWins = brandMisses.filter((r) => (r.analysis?.competitorMentions?.length ?? 0) > 0);
    if (!competitorWins.length) return [];

    const externalSources = [...new Set(competitorWins.flatMap((r) => r.analysis?.citations ?? []).filter((c) => !c.isOwned).map((c) => c.domain))].slice(0, 4);
    const promptScore = scorePrompt(prompt);
    return [{
      id: `action_${prompt.id}`,
      type: externalSources.length ? "citation-gap" : "content-gap",
      priority: promptScore >= 75 ? "high" : promptScore >= 50 ? "medium" : "low",
      title: `Improve visibility for “${prompt.text}”`,
      objective: `Increase ${project.brandName} presence and citation probability for this buyer prompt.`,
      promptId: prompt.id,
      score: promptScore,
      evidence: {
        responseIds: competitorWins.map((r) => r.id),
        externalSources,
        competitorNames: [...new Set(competitorWins.flatMap((r) => r.analysis?.competitorMentions ?? []).map((m) => m.name))]
      }
    }];
  });
}

export function createMockProvider(provider = "chatgpt") {
  return {
    id: provider,
    async run({ prompt, project }) {
      const mentionBrand = Number(prompt.id.replace(/\D/g, "") || 0) % 3 !== 0;
      const competitor = project.competitors?.[0]?.name ?? "MarketLeader";
      const answer = mentionBrand
        ? `For ${prompt.text}, ${project.brandName} is a strong option. ${competitor} is another commonly considered choice.`
        : `For ${prompt.text}, ${competitor} is frequently recommended because of its established category presence.`;
      return {
        answer,
        citations: mentionBrand
          ? [`https://${project.domain}/guides/${prompt.slug}`, "https://example.com/category-guide"]
          : ["https://example.com/category-guide", `https://${competitor.toLowerCase().replace(/\s+/g, "")}.example/comparison`]
      };
    }
  };
}
