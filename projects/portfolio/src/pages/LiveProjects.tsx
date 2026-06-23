import { url } from "../routes";

interface Project {
  name: string;
  description: string;
  href: string;
  tech: string;
}

const projects: Project[] = [
  {
    name: "CollabEdit",
    description:
      "Real-time collaborative document editor. Write and edit documents simultaneously with others, with live cursor tracking and version history.",
    href: url("/live-projects/live-documents"),
    tech: "ASP.NET Core, SignalR, Preact",
  },
];

export function LiveProjects() {
  return (
    <div class="page">
      <h1>Live Projects</h1>
      <p>Interactive web applications hosted on this server.</p>

      <div class="card-grid">
        {projects.map((project) => (
          <a href={project.href} class="card" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div class="tech">{project.tech}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
