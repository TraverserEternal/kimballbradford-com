import { useLocation } from "preact-iso";
import { url } from "../routes";
import { themes, currentTheme, setTheme } from "../theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/live-projects", label: "Live Projects" },
];

export function Navbar() {
  const { path } = useLocation();

  return (
    <nav class="navbar">
      <a href={url("/")} class="logo">Kimball Bradford</a>
      <div class="theme-dots">
        {themes.map((t) => (
          <button
            class={`theme-dot${currentTheme.value.name === t.name ? " theme-dot--active" : ""}`}
            style={{ background: t.circleColor }}
            onClick={() => setTheme(t.name)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
          />
        ))}
      </div>
      {links.map((link) => (
        <a
          href={url(link.href)}
          class={path === url(link.href) ? "active" : ""}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
