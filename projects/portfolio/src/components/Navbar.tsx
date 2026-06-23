import { useLocation } from "preact-iso";
import { url } from "../routes";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/live-projects", label: "Live Projects" },
];

export function Navbar() {
  const { path } = useLocation();

  return (
    <nav class="navbar">
      <a href={url("/")} class="logo">Kimball Bradford</a>
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
