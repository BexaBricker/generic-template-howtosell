// This serverless function handles contact form submissions
// Compatible with Vercel Functions and can be adapted for other platforms

const nodemailer = require('nodemailer');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting store (in production, use Redis or similar)
const submissionStore = new Map();

// Clean old entries from rate limit store
function cleanRateLimitStore() {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  
  for (const [key, timestamp] of submissionStore) {
    if (timestamp < oneHourAgo) {
      submissionStore.delete(key);
    }
  }
}

// Check rate limit
function checkRateLimit(identifier) {
  cleanRateLimitStore();
  
  const lastSubmission = submissionStore.get(identifier);
  const now = Date.now();
  
  if (lastSubmission && now - lastSubmission < 60000) { // 1 minute cooldown
    return false;
  }
  
  submissionStore.set(identifier, now);
  return true;
}

// Validate form data
function validateFormData(data) {
  const errors = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.workEmail || !emailRegex.test(data.workEmail)) {
    errors.push('Please provide a valid work email address');
  }
  
  if (!data.company || data.company.length < 2) {
    errors.push('Company name must be at least 2 characters');
  }
  
  // Check honeypot
  if (data.website) {
    errors.push('Invalid submission');
  }
  
  return errors;
}

// Create email transporter
function createTransporter() {
  // For production, use environment variables for credentials
  // Example for different email services:
  
  // SendGrid
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // AWS SES
  if (process.env.AWS_SES_REGION) {
    const aws = require('@aws-sdk/client-ses');
    const { defaultProvider } = require('@aws-sdk/credential-provider-node');
    const { createTransport } = require('nodemailer');
    const { SES } = aws;
    
    const ses = new SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_SES_REGION,
      defaultProvider
    });
    
    return createTransport({
      SES: { ses, aws }
    });
  }
  
  // Generic SMTP (for testing or other providers)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Main handler function
async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
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
    const data = req.body;
    
    // Validate data
    const errors = validateFormData(data);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Check rate limit
    const identifier = `${data.workEmail}-${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`;
    if (!checkRateLimit(identifier)) {
      return res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
    }
    
    // Create transporter
    const transporter = createTransporter();
    
    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@mybexa.com',
      to: process.env.TO_EMAIL || 'info@mybexa.com',
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
      text: `
        New Contact Form Submission
        
        Name: ${data.name}
        Work Email: ${data.workEmail}
        Company: ${data.company}
        ${data.telephone ? `Telephone: ${data.telephone}` : ''}
        ${data.message ? `Message: ${data.message}` : ''}
        
        Submitted at: ${new Date().toISOString()}
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to submitter (optional)
    if (process.env.SEND_CONFIRMATION === 'true') {
      const confirmationMail = {
        from: process.env.FROM_EMAIL || 'noreply@mybexa.com',
        to: data.workEmail,
        subject: 'Thank you for contacting BEXA',
        html: `
          <h2>Thank you for your inquiry</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <p>Best regards,<br>The BEXA Team</p>
        `,
        text: `
          Thank you for your inquiry
          
          Dear ${data.name},
          
          We have received your message and will get back to you soon.
          
          Best regards,
          The BEXA Team
        `
      };
      
      await transporter.sendMail(confirmationMail);
    }
    
    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handler;

// For Vercel
module.exports.default = handler;