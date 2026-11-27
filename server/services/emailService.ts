import nodemailer from 'nodemailer';
import { getEmailEnv } from '../config/env.js';
import { OrderRecord } from '../types/backend.types.js';
import {
  buildOrderCreatedEmail,
  buildOrderStatusUpdatedEmail,
} from './emailTemplates.js';
import {
  buildNewsletterCampaignEmail,
  buildNewsletterWelcomeEmail,
} from './newsletterEmailTemplates.js';

export interface EmailSendResult {
  sent: boolean;
  provider: 'gmail-smtp' | 'resend' | 'none';
  error?: string;
}

export function getEmailProviderStatus(): {
  configured: boolean;
  provider: 'gmail-smtp' | 'resend' | 'none';
} {
  const cfg = getEmailEnv();
  if (cfg.smtpUser && cfg.smtpPass) {
    return { configured: true, provider: 'gmail-smtp' };
  }
  if (cfg.resendApiKey) {
    return { configured: true, provider: 'resend' };
  }
  return { configured: false, provider: 'none' };
}

export async function dispatchHtmlEmail(
  to: string,
  subject: string,
  html: string
): Promise<EmailSendResult> {
  const cfg = getEmailEnv();

  if (cfg.smtpUser && cfg.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: cfg.smtpHost,
        port: cfg.smtpPort,
        secure: cfg.smtpPort === 465,
        auth: {
          user: cfg.smtpUser,
          pass: cfg.smtpPass,
        },
      });

      await transporter.sendMail({
        from: cfg.fromEmail,
        to,
        subject,
        html,
      });
      return { sent: true, provider: 'gmail-smtp' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi SMTP';
      console.error('[Email SMTP Error]', msg);
      return { sent: false, provider: 'gmail-smtp', error: msg };
    }
  }

  if (cfg.resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: cfg.fromEmail,
          to: [to],
          subject,
          html,
        }),
      });
      if (!response.ok) {
        const errBody = await response.text();
        return { sent: false, provider: 'resend', error: errBody };
      }
      return { sent: true, provider: 'resend' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi Resend API';
      return { sent: false, provider: 'resend', error: msg };
    }
  }

  return { sent: false, provider: 'none' };
}

export async function sendOrderCreatedEmail(order: OrderRecord): Promise<EmailSendResult> {
  const to = order.customer_email?.trim();
  if (!to) return { sent: false, provider: 'none' };

  const { siteUrl } = getEmailEnv();
  const { subject, html } = buildOrderCreatedEmail(order, siteUrl);
  return dispatchHtmlEmail(to, subject, html);
}

export async function sendOrderStatusEmail(order: OrderRecord): Promise<EmailSendResult> {
  const to = order.customer_email?.trim();
  if (!to) return { sent: false, provider: 'none' };

  const { siteUrl } = getEmailEnv();
  const { subject, html } = buildOrderStatusUpdatedEmail(order, siteUrl);
  return dispatchHtmlEmail(to, subject, html);
}

export async function sendNewsletterWelcomeEmail(email: string): Promise<EmailSendResult> {
  const clean = email.trim();
  if (!clean) return { sent: false, provider: 'none' };

  const { siteUrl } = getEmailEnv();
  const { subject, html } = buildNewsletterWelcomeEmail(clean, siteUrl);
  return dispatchHtmlEmail(clean, subject, html);
}

export async function sendNewsletterBroadcast(params: {
  recipients: string[];
  subject: string;
  content: string;
  promoCode?: string;
}): Promise<{ sentCount: number; total: number }> {
  const { siteUrl } = getEmailEnv();
  const { subject, html } = buildNewsletterCampaignEmail({
    subject: params.subject,
    content: params.content,
    promoCode: params.promoCode,
    ctaUrl: `${siteUrl}/#san-pham`,
  });

  let sentCount = 0;
  for (const email of params.recipients) {
    const res = await dispatchHtmlEmail(email, subject, html);
    if (res.sent) sentCount += 1;
  }

  return { sentCount, total: params.recipients.length };
}
