import { analyzeResponse, computeVisibility, generateActions } from "@visibility/core";

export const project = {
  id: "project_demo",
  name: "Northstar Analytics",
  brandName: "Northstar",
  domain: "northstar.example",
  language: "en",
  targetCountryCode: "US",
  timezone: "America/New_York",
  competitors: [
    { id: "brand_compass", name: "Compass AI" },
    { id: "brand_signal", name: "SignalDesk" },
    { id: "brand_lumen", name: "LumenRank" }
  ]
};

export const brand = { id: "brand_northstar", name: project.brandName, domain: project.domain };
export const prompts = [
  { id:"prompt1", slug:"best-ai-visibility-platform", text:"What is the best AI visibility platform for B2B SaaS?", intent:"recommendation", commercialIntent:5, volume:5, strategicFit:5, providers:["chatgpt","gemini","perplexity"] },
  { id:"prompt2", slug:"track-chatgpt-citations", text:"How can a marketing team track citations in ChatGPT answers?", intent:"informational", commercialIntent:4, volume:4, strategicFit:5, providers:["chatgpt","perplexity"] },
  { id:"prompt3", slug:"ai-search-competitor-analysis", text:"Best tools for AI search competitor analysis", intent:"recommendation", commercialIntent:5, volume:4, strategicFit:5, providers:["chatgpt","gemini"] },
  { id:"prompt4", slug:"geo-software", text:"Which GEO software should a startup use?", intent:"commercial", commercialIntent:5, volume:3, strategicFit:4, providers:["chatgpt","perplexity"] },
  { id:"prompt5", slug:"ai-crawler-monitoring", text:"How do I monitor AI crawlers on my website?", intent:"informational", commercialIntent:3, volume:3, strategicFit:4, providers:["gemini","perplexity"] }
];

const rawResponses = [
  ["r1","prompt1","chatgpt","Compass AI is a common choice. Northstar is strong for evidence-backed actions.",["https://reviewhub.example/ai-visibility","https://northstar.example/platform"]],
  ["r2","prompt1","gemini","Compass AI and SignalDesk are frequently considered for B2B visibility monitoring.",["https://reviewhub.example/ai-visibility","https://signaldesk.example/guide"]],
  ["r3","prompt2","chatgpt","Northstar can capture answer citations and map them back to prompts. Compass AI also reports source domains.",["https://northstar.example/citations","https://docs.example/geo"]],
  ["r4","prompt3","chatgpt","SignalDesk is often recommended for competitor analysis, followed by Compass AI.",["https://growth.example/best-geo-tools","https://community.example/thread/124"]],
  ["r5","prompt4","perplexity","Northstar is a useful GEO workflow for startups because it connects evidence to actions.",["https://northstar.example/startups","https://reviewhub.example/geo"]],
  ["r6","prompt5","gemini","For crawler monitoring, Compass AI offers logs while Northstar links crawler events to opportunities.",["https://northstar.example/crawlers","https://infra.example/ai-bots"]]
];

export const responses = rawResponses.map(([id,promptId,provider,answer,citations]) => ({
  id,promptId,provider,answer,citations,
  createdAt:"2026-09-03T20:00:00Z",
  analysis: analyzeResponse({ answer, brand, competitors: project.competitors, citations })
}));

export const visibility = computeVisibility(responses, brand.id);
export const actions = generateActions({ project, prompts, responses });
export const articles = [
  { id:"a1", title:"How AI answer engines choose citation sources", status:"draft", actionId:"action_prompt3", scheduledAt:null },
  { id:"a2", title:"AI crawler monitoring: an operator's guide", status:"scheduled", actionId:null, scheduledAt:"2026-09-08T14:00:00Z" },
  { id:"a3", title:"Northstar vs legacy rank trackers", status:"idea", actionId:"action_prompt1", scheduledAt:null }
];

export const crawlerEvents = [
  { id:"c1", provider:"openai", bot:"GPTBot", category:"training", path:"/platform", statusCode:200, verificationStatus:"verified" },
  { id:"c2", provider:"openai", bot:"ChatGPT-User", category:"answer_fetch", path:"/citations", statusCode:200, verificationStatus:"verified" },
  { id:"c3", provider:"perplexity", bot:"PerplexityBot", category:"indexing", path:"/old-comparison", statusCode:404, verificationStatus:"verified" }
];
