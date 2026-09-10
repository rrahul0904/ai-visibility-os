import { project, prompts, responses, actions, articles, crawlerEvents, visibility } from "./demo-data";

export function getDemoStore() {
  return {
    async getProject() { return project; },
    async listPrompts() { return prompts; },
    async listResponses() { return responses; },
    async listCitations() { return responses.flatMap((r) => r.analysis.citations.map((c, index) => ({ id:`${r.id}_c${index}`, projectId:project.id, responseId:r.id, promptId:r.promptId, provider:r.provider, ...c }))); },
    async getVisibility() { return visibility; },
    async listActions() { return actions; },
    async listArticles() { return articles; },
    async listCrawlerEvents() { return crawlerEvents; }
  };
}

export async function getStore() {
  return getDemoStore();
}
