export default function Home() {
  return <main className="hero"><div className="hero-inner">
    <div className="eyebrow">AI DISCOVERY OPERATING SYSTEM</div>
    <h1>Know why AI recommends competitors. Then change the answer.</h1>
    <p>Monitor buyer prompts, preserve answer evidence, map citations, detect visibility gaps, turn them into prioritized actions, and measure whether your interventions changed AI recommendations.</p>
    <a className="cta" href="/dashboard">Open live product demo →</a>
    <div className="flow">
      {[
        ["01","Observe","Run commercial prompts across AI-answer providers."],
        ["02","Explain","Extract brand mentions, competitors, position and citations."],
        ["03","Prioritize","Score gaps by buyer intent, volume and strategic fit."],
        ["04","Execute","Create evidence-backed content and citation actions."],
        ["05","Remeasure","Track whether visibility and citation share improve."]
      ].map(([i,t,d]) => <div className="card" key={i}><div className="flow-index">{i}</div><h3>{t}</h3><div className="muted">{d}</div></div>)}
    </div>
  </div></main>;
}
