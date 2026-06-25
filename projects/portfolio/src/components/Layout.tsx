import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const onScroll = () => {
      el.style.transform = `translateY(${-window.scrollY * 0.35}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div class="layout">
      <div ref={bgRef} class="bg-dots" />
      <Navbar />
      <main>{children}</main>
      <footer class="footer">
        &copy; {new Date().getFullYear()} Kimball Bradford
      </footer>
    </div>
  );
}
