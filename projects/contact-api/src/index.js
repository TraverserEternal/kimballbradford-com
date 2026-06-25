import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const {
  SMTP_HOST = "smtp.gmail.com",
  SMTP_PORT = "587",
  SMTP_USER,
  SMTP_PASS,
  CONTACT_EMAIL_RECIPIENT,
  CONTACT_EMAIL_FROM,
  PORT = "3000",
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    const errors = [];
    if (!name || !name.trim()) errors.push("Name is required");
    if (!email || !email.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push("Invalid email address");
    if (!message || !message.trim()) errors.push("Message is required");
    else if (message.trim().length < 10)
      errors.push("Message must be at least 10 characters");

    if (errors.length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    await transporter.sendMail({
      from: CONTACT_EMAIL_FROM,
      to: CONTACT_EMAIL_RECIPIENT,
      replyTo: email,
      subject: `Portfolio Contact: ${name.trim()}`,
      text: `From: ${name.trim()} (${email.trim()})\n\n${message.trim()}`,
    });

    console.log(`Email sent from ${email} (${name})`);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    res.status(500).json({ ok: false, errors: ["Failed to send message. Please try again later."] });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`contact-api listening on port ${PORT}`);
});
