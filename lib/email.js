import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendDeadlineEmail = async (developerEmail, developerName, projectName, deadline) => {
  try {
    const info = await transporter.sendMail({
      from: `"Team Shogun Alerts" <${process.env.SMTP_USER}>`,
      to: developerEmail,
      subject: `🚨 Urgent: Deadline Approaching for ${projectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ef4444;">Deadline Alert!</h2>
          <p>Hi <strong>${developerName}</strong>,</p>
          <p>This is an automated reminder that the deadline for your assigned project <strong>${projectName}</strong> is approaching.</p>
          <p style="padding: 15px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
            <strong>Deadline:</strong> ${new Date(deadline).toLocaleString()}
          </p>
          <p>Please ensure you complete the necessary tasks or update the project status accordingly.</p>
          <br/>
          <p style="font-size: 12px; color: #888;">This is an automated message from the Team Shogun Platform.</p>
        </div>
      `,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
