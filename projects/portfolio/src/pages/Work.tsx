import { ContactForm } from "../components/ContactForm";

export function Work() {
  return (
    <div class="page">
      <h1>Work</h1>
      <p>Professional experience and projects I&rsquo;ve built.</p>

      <div class="entry-list">
        <article class="entry">
          <div class="meta">2024 &mdash; Present</div>
          <h2>Full-Stack Developer</h2>
          <p>
            Building a real-time collaborative document editing platform with
            ASP.NET Core SignalR, Preact SPA frontends, and Docker-based
            deployment. Designed and implemented the architecture for a
            multi-project portfolio site behind a Traefik reverse proxy on
            DigitalOcean.
          </p>
        </article>

        <article class="entry">
          <div class="meta">2023 &mdash; 2024</div>
          <h2>Software Engineer</h2>
          <p>
            Developed and maintained web applications using modern
            JavaScript and TypeScript frameworks. Worked on RESTful API design,
            database schema optimization, and CI/CD pipeline improvements.
            Collaborated on architecture decisions for scalable cloud deployments.
          </p>
        </article>

        <article class="entry">
          <div class="meta">2021 &mdash; 2023</div>
          <h2>Junior Developer</h2>
          <p>
            Contributed to full-stack development of customer-facing web
            applications. Built responsive UIs with React and Vue.js,
            implemented automated testing, and participated in code review
            processes. Gained deep experience with PostgreSQL and Redis.
          </p>
        </article>
      </div>

      <section class="contact-section">
        <h2>Interested in working together?</h2>
        <p>Let&rsquo;s talk about your next project.</p>
        <ContactForm />
      </section>
    </div>
  );
}
