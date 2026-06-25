import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

interface ProjectCardProps {
  title: string;
  tags: string[];
  href?: string;
  children: ComponentChildren;
}

export function ProjectCard({ title, tags, href, children }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article class="entry">
      {href && (
        <a href={href} class="project-link" target="_blank" rel="noopener noreferrer">
          View Live Project &rarr;
        </a>
      )}
      <button
        class="entry-header"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <h2>{title}</h2>
        <svg
          class={`chevron${expanded ? " chevron--open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <polyline points="7 8 10 11 13 8" />
        </svg>
      </button>
      <div class="tags">
        {tags.map((tag) => (
          <span class="tag" key={tag}>{tag}</span>
        ))}
      </div>
      <div class={`entry-body${expanded ? "" : " entry-body--collapsed"}`}>{children}</div>
    </article>
  );
}
