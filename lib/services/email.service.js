import nodemailer from 'nodemailer';
import { config } from '@/lib/config';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  async sendMail({ to, subject, html, fromName = "Team Shogun Alerts" }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${fromName}" <${config.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Email Service Error:", error);
      return { success: false, error: error.message };
    }
  }

  async sendDeadlineEmail(developerEmail, developerName, projectName, deadline, urgency = "⚠️ WARNING") {
    const isCritical = urgency.includes("CRITICAL");
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${isCritical ? '#ef4444' : '#f59e0b'};">${urgency}: Deadline Alert!</h2>
        <p>Hi <strong>${developerName}</strong>,</p>
        <p>This is an automated reminder that the deadline for your assigned project <strong>${projectName}</strong> is approaching.</p>
        <p style="padding: 15px; background: ${isCritical ? '#fef2f2' : '#fffbeb'}; border-left: 4px solid ${isCritical ? '#ef4444' : '#f59e0b'}; border-radius: 4px;">
          <strong>Deadline:</strong> ${new Date(deadline).toLocaleString()}
        </p>
        <p>Please ensure you complete the necessary tasks or update the project status accordingly.</p>
        <br/>
        <p style="font-size: 12px; color: #888;">This is an automated message from the Team Shogun Platform.</p>
      </div>
    `;

    return this.sendMail({
      to: developerEmail,
      subject: `${urgency}: Deadline Approaching for ${projectName}`,
      html,
    });
  }
}

export const emailService = new EmailService();
