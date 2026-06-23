import type { ComponentChildren } from "preact";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div class="layout">
      <Navbar />
      <main>{children}</main>
      <footer class="footer">
        &copy; {new Date().getFullYear()} Kimball Bradford
      </footer>
    </div>
  );
}
