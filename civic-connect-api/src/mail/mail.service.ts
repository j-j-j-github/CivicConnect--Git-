import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    
    this.logger.log(`Sending password reset email to ${to}. Link: ${resetLink}`);
    
    if (!process.env.SMTP_HOST) {
      this.logger.warn(`No SMTP_HOST configured. Outputting link to console: ${resetLink}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Civic Connect" <noreply@civicconnect.com>',
        to,
        subject: 'Password Reset Request - Civic Connect',
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset. Click the link below to reset your password.</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
      this.logger.log(`Password reset email sent to ${to}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Preview email at Ethereal: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
    }
  }
}
