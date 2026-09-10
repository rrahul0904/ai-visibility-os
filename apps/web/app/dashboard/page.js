import { AppShell, PageHeader } from "../../components/shell";
import { getStore } from "../../lib/store";

export default async function DashboardPage() {
  const store = await getStore();
  const [metrics, actions, prompts, responses] = await Promise.all([store.getVisibility(), store.listActions(), store.listPrompts(), store.listResponses()]);
  const cards = [
    ["Organic visibility", `${metrics.visibility}%`, "+6.8 pts vs baseline"],
    ["Share of voice", `${metrics.shareOfVoice}%`, "Across detected brands"],
    ["Citation share", `${metrics.citationShare}%`, "Owned-domain citations"],
    ["First position", `${metrics.firstPositionRate}%`, "Brand leads the answer"]
  ];
  return <AppShell><PageHeader eyebrow="Executive overview" title="AI discovery performance" description="What answer engines are saying, why competitors win, and which interventions should happen next."/>
    <div className="grid metrics">{cards.map(([l,v,d]) => <div className="card" key={l}><div className="metric-label">{l}</div><div className="metric-value">{v}</div><div className="metric-delta">{d}</div></div>)}</div>
    <div className="section"><div className="section-head"><h2>Highest-impact actions</h2><a className="pill" href="/actions">View all</a></div><div className="table-wrap"><table><thead><tr><th>Action</th><th>Priority</th><th>Score</th><th>Evidence</th></tr></thead><tbody>{actions.map(a => <tr key={a.id}><td><strong>{a.title}</strong><div className="muted">{a.type}</div></td><td className={`priority-${a.priority}`}>{a.priority}</td><td className="score">{a.score}</td><td>{a.evidence.competitorNames.join(", ") || "—"}<div className="muted">{a.evidence.externalSources.join(", ")}</div></td></tr>)}</tbody></table></div></div>
    <div className="section"><div className="section-head"><h2>Monitoring coverage</h2><span className="pill">{responses.length} fresh answers</span></div><div className="card"><strong>{prompts.length} buyer prompts</strong><div className="muted" style={{marginTop:7}}>Recommendation, comparison, commercial and informational intent. Each prompt can run against a provider portfolio and retain full evidence.</div></div></div>
  </AppShell>;
}
