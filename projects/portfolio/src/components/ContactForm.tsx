export function ContactForm() {
  return (
    <form class="contact-form" onSubmit={(e) => e.preventDefault()}>
      <label>
        Name
        <input type="text" placeholder="Your name" />
      </label>
      <label>
        Email
        <input type="email" placeholder="you@example.com" />
      </label>
      <label>
        Message
        <textarea rows={5} placeholder="Your message..." />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
