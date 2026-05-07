import { AuditForm } from "@/components/audit-form";

export default function HomePage() {
  return (
    <main className="shell">
      <AuditForm />
      <section className="footerGrid">
        <div className="card panel">
          <h3>Built for startup operators</h3>
          <p className="muted">Designed for founders, engineering managers, and finance-conscious leads who need a quick second opinion on AI tooling spend.</p>
        </div>
        <div className="card panel">
          <h3>Value before gate</h3>
          <p className="muted">The app shows full savings on-screen first. Email is only requested after the user has already received the audit.</p>
        </div>
        <div className="card panel">
          <h3>Accessible by default</h3>
          <p className="muted">Semantic controls, visible focus states, large tap targets, and server-rendered content keep the experience lightweight and readable.</p>
        </div>
      </section>
    </main>
  );
}

