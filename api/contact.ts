import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as z from 'zod';

// Environment variables type
interface Env {
  SENDGRID_API_KEY?: string;
  RESEND_API_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_SECURE?: string;
  FROM_EMAIL: string;
  TO_EMAIL: string;
  FRONTEND_URL?: string;
  SEND_CONFIRMATION?: string;
  TURNSTILE_SECRET_KEY?: string; // Cloudflare Turnstile for CAPTCHA
}

// Form data schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  workEmail: z.string().email(),
  telephone: z.string().optional(),
  company: z.string().min(2),
  message: z.string().min(10),
  website: z.string().max(0), // Honeypot
  captchaToken: z.string().optional(), // For CAPTCHA verification
});

// Rate limiting store
const rateLimitStore = new Map<string, number>();

// Clean old entries
function cleanRateLimitStore(): void {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  
  for (const [key, timestamp] of rateLimitStore) {
    if (timestamp < oneHourAgo) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit
function checkRateLimit(identifier: string): boolean {
  cleanRateLimitStore();
  
  const lastSubmission = rateLimitStore.get(identifier);
  const now = Date.now();
  
  if (lastSubmission && now - lastSubmission < 60000) {
    return false;
  }
  
  rateLimitStore.set(identifier, now);
  return true;
}

// Verify CAPTCHA token
async function verifyCaptcha(token: string, secretKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
}

// Send email using Resend
async function sendEmailWithResend(apiKey: string, data: z.infer<typeof contactFormSchema>, env: Env) {
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  
  // Send notification email
  await resend.emails.send({
    from: env.FROM_EMAIL,
    to: env.TO_EMAIL,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Work Email:</strong> ${data.workEmail}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      ${data.telephone ? `<p><strong>Telephone:</strong> ${data.telephone}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `,
  });
  
  // Send confirmation email if enabled
  if (env.SEND_CONFIRMATION === 'true') {
    await resend.emails.send({
      from: env.FROM_EMAIL,
      to: data.workEmail,
      subject: 'Thank you for contacting BEXA',
      html: `
        <h2>Thank you for your inquiry</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>The BEXA Team</p>
      `,
    });
  }
}

// Send email using SMTP
async function sendEmailWithSMTP(data: z.infer<typeof contactFormSchema>, env: Env) {
  const nodemailer = await import('nodemailer');
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587'),
    secure: env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  
  // Send notification email
  await transporter.sendMail({
    from: env.FROM_EMAIL,
    to: env.TO_EMAIL,
    subject: `New Contact Form Submission from ${data.name}`,
    text: `
      New Contact Form Submission
      
      Name: ${data.name}
      Work Email: ${data.workEmail}
      Company: ${data.company}
      ${data.telephone ? `Telephone: ${data.telephone}` : ''}
      ${data.message ? `Message: ${data.message}` : ''}
      
      Submitted at: ${new Date().toISOString()}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Work Email:</strong> ${data.workEmail}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      ${data.telephone ? `<p><strong>Telephone:</strong> ${data.telephone}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `,
  });
  
  // Send confirmation email if enabled
  if (env.SEND_CONFIRMATION === 'true') {
    await transporter.sendMail({
      from: env.FROM_EMAIL,
      to: data.workEmail,
      subject: 'Thank you for contacting BEXA',
      text: `
        Thank you for your inquiry
        
        Dear ${data.name},
        
        We have received your message and will get back to you soon.
        
        Best regards,
        The BEXA Team
      `,
      html: `
        <h2>Thank you for your inquiry</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>The BEXA Team</p>
      `,
    });
  }
}

// Send email using SendGrid
async function sendEmailWithSendGrid(apiKey: string, data: z.infer<typeof contactFormSchema>, env: Env) {
  const sgMail = await import('@sendgrid/mail');
  sgMail.default.setApiKey(apiKey);
  
  // Send notification email
  await sgMail.default.send({
    to: env.TO_EMAIL,
    from: env.FROM_EMAIL,
    subject: `New Contact Form Submission from ${data.name}`,
    text: `
      New Contact Form Submission
      
      Name: ${data.name}
      Work Email: ${data.workEmail}
      Company: ${data.company}
      ${data.telephone ? `Telephone: ${data.telephone}` : ''}
      ${data.message ? `Message: ${data.message}` : ''}
      
      Submitted at: ${new Date().toISOString()}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Work Email:</strong> ${data.workEmail}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      ${data.telephone ? `<p><strong>Telephone:</strong> ${data.telephone}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `,
  });
  
  // Send confirmation email if enabled
  if (env.SEND_CONFIRMATION === 'true') {
    await sgMail.default.send({
      to: data.workEmail,
      from: env.FROM_EMAIL,
      subject: 'Thank you for contacting BEXA',
      text: `
        Thank you for your inquiry
        
        Dear ${data.name},
        
        We have received your message and will get back to you soon.
        
        Best regards,
        The BEXA Team
      `,
      html: `
        <h2>Thank you for your inquiry</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>The BEXA Team</p>
      `,
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get environment variables
  const env: Env = {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE,
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@mybexa.com',
    TO_EMAIL: process.env.TO_EMAIL || 'info@mybexa.com',
    FRONTEND_URL: process.env.FRONTEND_URL,
    SEND_CONFIRMATION: process.env.SEND_CONFIRMATION,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  };
  
  // Set CORS headers
  const allowedOrigin = env.FRONTEND_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse and validate request body
    const parseResult = contactFormSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid form data', 
        details: parseResult.error.flatten() 
      });
    }
    
    const data = parseResult.data;
    
    // Check honeypot
    if (data.website) {
      // Silently accept but don't process spam
      return res.status(200).json({ success: true });
    }
    
    // Verify CAPTCHA if enabled
    if (env.TURNSTILE_SECRET_KEY && data.captchaToken) {
      const captchaValid = await verifyCaptcha(data.captchaToken, env.TURNSTILE_SECRET_KEY);
      if (!captchaValid) {
        return res.status(400).json({ error: 'CAPTCHA verification failed' });
      }
    }
    
    // Check rate limit
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const identifier = `${data.workEmail}-${clientIp}`;
    
    if (!checkRateLimit(identifier)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait before submitting again.' 
      });
    }
    
    // Send email based on available service
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      await sendEmailWithSMTP(data, env);
    } else if (env.RESEND_API_KEY) {
      await sendEmailWithResend(env.RESEND_API_KEY, data, env);
    } else if (env.SENDGRID_API_KEY) {
      await sendEmailWithSendGrid(env.SENDGRID_API_KEY, data, env);
    } else {
      console.error('No email service configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting us. We will get back to you soon.' 
    });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ error: 'Failed to process form submission' });
  }
}