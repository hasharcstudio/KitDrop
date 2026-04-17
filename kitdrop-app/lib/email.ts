import emailjs from '@emailjs/browser';

/**
 * Sends a welcome email when a new customer registers.
 * Requires an EmailJS account (Free tier works perfectly).
 * 
 * setup instructions:
 * 1. Register at EmailJS
 * 2. Add an Email Service (e.g. Gmail)
 * 3. Create an Email Template
 * 4. Put the Keys below
 */
export async function sendWelcomeEmail(toEmail: string, toName: string) {
  try {
    // Replace these credentials with your EmailJS keys from dashboard
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      console.warn("EmailJS is not configured yet. Skipping welcome email.");
      return;
    }

    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      message: "Welcome to KitDrop! Your global archive access is now active.",
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log("Welcome email sent successfully.");
  } catch (error) {
    console.error("Failed to send welcome email via EmailJS:", error);
  }
}
