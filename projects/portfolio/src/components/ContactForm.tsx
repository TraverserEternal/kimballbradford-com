import { useState } from "preact/hooks";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email address";
    if (!message.trim()) errs.message = "Message is required";
    else if (message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSubmitted(false);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  const handleInput = (set: (v: string) => void) => (e: Event) => {
    set((e.target as HTMLInputElement | HTMLTextAreaElement).value);
  };

  return (
    <form class="contact-form" onSubmit={handleSubmit} noValidate>
      <div class={`field${errors.name ? " has-error" : ""}`}>
        <label>
          Name
          <input type="text" placeholder="Your name" value={name} onInput={handleInput(setName)} />
        </label>
        {errors.name && <span class="error">{errors.name}</span>}
      </div>
      <div class={`field${errors.email ? " has-error" : ""}`}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" value={email} onInput={handleInput(setEmail)} />
        </label>
        {errors.email && <span class="error">{errors.email}</span>}
      </div>
      <div class={`field${errors.message ? " has-error" : ""}`}>
        <label>
          Message
          <textarea rows={5} placeholder="Your message..." value={message} onInput={handleInput(setMessage)} />
        </label>
        {errors.message && <span class="error">{errors.message}</span>}
      </div>
      <button type="submit">Send Message</button>
      {submitted && <div class="success">Thanks for reaching out! I&rsquo;ll get back to you soon.</div>}
    </form>
  );
}
