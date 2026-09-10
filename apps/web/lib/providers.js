export class ProviderError extends Error {
  constructor(provider, message, details){ super(message); this.name="ProviderError"; this.provider=provider; this.details=details; }
}

export const providerAdapters = {
  anthropic: {
    configured: () => Boolean(process.env.ANTHROPIC_API_KEY),
    async run(prompt){
      const response=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})});
      if(!response.ok) throw new ProviderError("anthropic",`HTTP ${response.status}`,await response.text());
      const json=await response.json(); return {answer:json.content?.map(x=>x.text||"").join("\n")||"",citations:[]};
    }
  },
  perplexity: {
    configured: () => Boolean(process.env.PERPLEXITY_API_KEY),
    async run(prompt){
      const response=await fetch("https://api.perplexity.ai/chat/completions",{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${process.env.PERPLEXITY_API_KEY}`},body:JSON.stringify({model:process.env.PERPLEXITY_MODEL || "sonar",messages:[{role:"user",content:prompt}]})});
      if(!response.ok) throw new ProviderError("perplexity",`HTTP ${response.status}`,await response.text());
      const json=await response.json(); return {answer:json.choices?.[0]?.message?.content||"",citations:json.citations||[]};
    }
  }
};
