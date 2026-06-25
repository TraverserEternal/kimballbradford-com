import { url } from "../routes";
import { ContactForm } from "../components/ContactForm";
import { DotMask } from "../components/DotMask";

export function Home() {
  return (
    <div class="page">
      <DotMask cy="12%" />
      <section class="hero">
        <h1>Kimball Bradford</h1>
        <p>
          I build practical software across disciplines- optimized sites
          and portfolios, professional desktop tools, encrypted mobile apps,
          and more.
        </p>
        <div class="links">
          <a href={url("/work")} class="btn">View My Work</a>
          <a href={url("/live-projects")} class="btn">Live Projects</a>
        </div>
      </section>

      <section class="contact-section">
        <h2>Get in Touch</h2>
        <p>Have a question or want to work together? Send me a message.</p>
        <ContactForm />
      </section>
    </div>
  );
}
