import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.warn("Email configuration missing (EMAIL_USER or EMAIL_PASS). Skipping email send.");
      return false;
    }

    // Check if host is accidentally set to an email address
    if (host.includes("@")) {
      console.error(`Invalid EMAIL_HOST: "${host}". It should be an SMTP server (e.g., smtp.gmail.com), not an email address.`);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Project Manager" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};
