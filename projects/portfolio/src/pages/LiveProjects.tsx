import { ProjectCard } from "../components/ProjectCard";
import { url } from "../routes";

interface Project {
  name: string;
  href: string;
  tags: string[];
}

const projects: Project[] = [
  {
    name: "CollabEdit",
    href: url("/live-projects/live-documents"),
    tags: ["C#", "ASP.NET Core", "SignalR", "Preact", "WebSockets"],
  },
];

export function LiveProjects() {
  return (
    <div class="page">
      <h1>Live Projects</h1>
      <p>Interactive web applications hosted on this server.</p>

      <div class="entry-list">
        {projects.map((project) => (
          <ProjectCard
            title={project.name}
            tags={project.tags}
            href={project.href}
            key={project.name}
          >
            <p>
              CollabEdit is a real-time collaborative document editor. While the
              interface is intentionally streamlined, the core objective of this
              project was to demonstrate proficiency in asynchronous networking,
              WebSockets, and distributed state synchronization using C#. The
              entire application—both the Preact frontend and the .NET
              backend—runs fluidly on a basic $4/month DigitalOcean droplet,
              highlighting how lightweight and performant real-time state
              synchronization can be when properly architected.
            </p>

            <h3>The Implementation</h3>
            <p>
              Building a collaborative editor introduces a classic distributed
              systems challenge: concurrency and state divergence. If two users
              type in the same paragraph simultaneously, network latency will
              cause their local screens to drift out of sync.
            </p>
            <p>
              To solve this, I built a character-level Operational Transform
              (OT) engine:
            </p>
            <ul>
              <li>
                The backend is built as an ASP.NET Core Minimal API using
                SignalR to manage persistent WebSocket connections, handle
                authentication via JWTs passed during the WebSocket handshake,
                and organize users into document-specific communication groups.
              </li>
              <li>
                When a user types, the client captures the edit as an operation
                (an insert or delete) and sends it to the server. If an
                operation arrives lagging behind the current document version,
                the server's OTService automatically transforms it against the
                intervening historical operations. A mirrored layer runs on the
                Preact client, transforming incoming remote edits against
                pending local changes before updating the screen, guaranteeing
                that both documents eventually converge on the exact same state.
              </li>
              <li>
                Instead of using a restrictive <code>textarea</code>, the
                frontend uses a <code>contentEditable</code> container. This
                allows the layout engine to calculate exact pixel coordinates
                for text characters, which I used to map absolute-positioned,
                multi-colored cursor overlays for remote users in real time.
              </li>
            </ul>
            <p>
              To maximize performance, I avoided writing to disk on every single
              keystroke. The server retains active document state in an
              in-memory cache while users are actively editing. The final,
              compiled document is only persisted to a local SQLite database via
              EF Core when the last remaining user disconnects from the session.
            </p>

            <h3>What I Learned</h3>
            <p>
              Real-time state synchronization is an incredibly humbling problem.
              Designing an Operational Transform system from scratch forces you
              to account for highly volatile edge cases born entirely from
              network latency and concurrent user actions.
            </p>
            <p>
              This project reinforced the value of decoupling high-frequency,
              low-latency actions (like character inputs over WebSockets) from
              traditional persistence layers. It taught me how to manage
              application state at scale without bottlenecking the user
              experience, and proved that a well-optimized architecture doesn't
              require expensive cloud infrastructure to run efficiently.
            </p>
            <p>
              You can review the full implementation of the OT engine and the
              multi-container Docker setup directly on{" "}
              <a
                href="https://github.com/TraverserEternal/live-documents"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </ProjectCard>
        ))}
      </div>
    </div>
  );
}
