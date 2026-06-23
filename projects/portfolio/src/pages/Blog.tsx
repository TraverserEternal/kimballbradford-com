export function Blog() {
  return (
    <div class="page">
      <h1>Blog</h1>
      <p>Thoughts on software engineering, architecture, and tools.</p>

      <div class="entry-list">
        <article class="entry">
          <div class="meta">June 2026</div>
          <h2>Building a Multi-Project Portfolio on a Single Droplet</h2>
          <p>
            How I set up Traefik reverse proxy to serve multiple web
            applications from one DigitalOcean VM, with automatic HTTPS via
            Let&rsquo;s Encrypt and sub-path routing for each project.
          </p>
        </article>

        <article class="entry">
          <div class="meta">May 2026</div>
          <h2>Real-Time Collaboration with SignalR</h2>
          <p>
            Exploring WebSocket-based real-time document editing using ASP.NET
            Core SignalR. Architecture decisions, conflict resolution
            strategies, and lessons learned from building a collaborative editor.
          </p>
        </article>

        <article class="entry">
          <div class="meta">April 2026</div>
          <h2>Why Preact for SPAs in 2026</h2>
          <p>
            A look at the Preact ecosystem &mdash; why I chose it over React for
            my portfolio site, the developer experience, and how preact-iso
            simplifies routing without Next.js-style frameworks.
          </p>
        </article>
      </div>
    </div>
  );
}
