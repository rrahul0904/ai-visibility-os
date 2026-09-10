const nav = [
  ["Overview","/dashboard"], ["Buyer prompts","/prompts"], ["AI responses","/responses"],
  ["Citations","/citations"], ["Actions","/actions"], ["Content","/articles"], ["Settings","/settings"]
];

export function AppShell({ children }) {
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">Visibility<span>OS</span></div>
      <nav className="nav">{nav.map(([label,href]) => <a href={href} key={href}>{label}</a>)}</nav>
      <div className="sidebar-footer">Evidence-first AI discovery operations<br/>Demo workspace · US / EN</div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="project-picker"><span className="status-dot"/>Northstar Analytics</div><div className="pill">Daily monitoring active</div></header>
      <div className="content">{children}</div>
    </section>
  </div>;
}

export function PageHeader({ eyebrow, title, description }) {
  return <><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description ? <p className="lede">{description}</p> : null}</>;
}
