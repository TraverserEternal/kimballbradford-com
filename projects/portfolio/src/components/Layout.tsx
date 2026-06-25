import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.style.setProperty(
        '--scroll-offset',
        `${-window.scrollY * 0.35}px`
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div class="layout">
      <div class="bg-dots" />
      <div class="dot-bottom-fade" />
      <Navbar />
      <main>{children}</main>
      <footer class="footer">
        &copy; {new Date().getFullYear()} Kimball Bradford
      </footer>
    </div>
  );
}
