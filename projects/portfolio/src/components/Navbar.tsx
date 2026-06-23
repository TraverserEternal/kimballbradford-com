import { url } from "../routes";

export function Navbar() {
  return (
    <nav class="navbar">
      <a href={url("/")} class="logo">Kimball Bradford</a>
      <a href={url("/work")}>Work</a>
      <a href={url("/blog")}>Blog</a>
      <a href={url("/live-projects")}>Live Projects</a>
    </nav>
  );
}
