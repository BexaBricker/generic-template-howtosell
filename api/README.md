# BEXA Contact Form Backend

This backend service handles contact form submissions with spam protection and email delivery.

## Features

- **Email Service Support**: Resend, SendGrid, or custom SMTP
- **Spam Protection**: 
  - Honeypot field detection
  - Rate limiting (1 minute cooldown)
  - Optional CAPTCHA (Cloudflare Turnstile)
- **Validation**: Server-side form validation with Zod
- **CORS**: Configurable CORS for production
- **Confirmation Emails**: Optional auto-reply to submitters

## Setup Instructions

### 1. Choose an Email Service

#### Option A: Resend (Recommended - Easiest)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add domain verification for better deliverability

#### Option B: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify your sender domain

### 2. Set Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# Choose one email service:
RESEND_API_KEY=re_xxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Email settings
FROM_EMAIL=noreply@mybexa.com
TO_EMAIL=info@mybexa.com
SEND_CONFIRMATION=true

# Your frontend URL
FRONTEND_URL=https://your-domain.com

# Optional: Cloudflare Turnstile
TURNSTILE_SECRET_KEY=0x4AAAAAAxxxxx
```

### 3. Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### 4. Update Frontend

Set the API URL in your frontend `.env`:
```
VITE_API_URL=https://your-vercel-app.vercel.app/api
```

## Alternative Deployment Options

### Netlify Functions
1. Move `api/contact.ts` to `netlify/functions/contact.ts`
2. Update the API path in frontend
3. Deploy to Netlify

### AWS Lambda
1. Use the JavaScript version (`contact.js`)
2. Create Lambda function
3. Set up API Gateway
4. Configure environment variables

### Express Server
Convert the serverless function to an Express endpoint for traditional hosting.

## Testing

Test the endpoint with curl:
```bash
curl -X POST https://your-api/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "workEmail": "test@example.com",
    "company": "Test Company",
    "message": "Test message"
  }'
```

## Security Considerations

1. **Rate Limiting**: Currently in-memory, use Redis for production scale
2. **CAPTCHA**: Add Cloudflare Turnstile for additional protection
3. **Email Validation**: Validates email format server-side
4. **Honeypot**: Hidden field to catch bots
5. **CORS**: Restrict to your domain in production

## Monitoring

- Check Vercel logs for errors
- Monitor email service dashboard for delivery rates
- Set up alerts for high error rates