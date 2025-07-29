import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  workEmail: z.string().email('Please enter a valid work email address'),
  telephone: z.string().optional(),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Honeypot field for spam protection
  website: z.string().max(0, 'This field should be left empty'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      website: '', // Honeypot field
    },
  });

  // Update cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTime;
      const cooldownPeriod = 60000; // 1 minute cooldown
      
      if (timeSinceLastSubmit < cooldownPeriod) {
        setCooldownRemaining(Math.ceil((cooldownPeriod - timeSinceLastSubmit) / 1000));
      } else {
        setCooldownRemaining(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSubmitTime]);

  const onSubmit = async (data: ContactFormData) => {
    // Check cooldown
    if (cooldownRemaining > 0) {
      return;
    }

    // Check honeypot
    if (data.website) {
      // Silently reject spam
      setSubmitStatus('success');
      reset();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Get API URL from environment or use relative path
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          workEmail: data.workEmail,
          telephone: data.telephone || undefined,
          company: data.company,
          message: data.message || undefined,
          website: data.website, // Include honeypot
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          setLastSubmitTime(Date.now());
        }
        // Handle missing email service configuration
        if (response.status === 500 && result.error === 'Email service not configured') {
          throw new Error('The contact form is not yet configured. Please contact us directly at info@mybexa.com');
        }
        throw new Error(result.error || 'Failed to submit form. Please try again or contact us directly at info@mybexa.com');
      }

      setSubmitStatus('success');
      setLastSubmitTime(Date.now());
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setErrorMessage('Unable to connect to the server. Please check your internet connection or contact us directly at info@mybexa.com');
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again or contact us directly at info@mybexa.com');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-spacing bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-center mb-6 text-primary">
          Contact Us
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="workEmail">Work Email *</Label>
              <Input
                id="workEmail"
                type="email"
                {...register('workEmail')}
                placeholder="your.name@company.com"
                className={errors.workEmail ? 'border-red-500' : ''}
              />
              {errors.workEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.workEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Your company name"
                className={errors.company ? 'border-red-500' : ''}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telephone">Telephone (Optional)</Label>
              <Input
                id="telephone"
                type="tel"
                {...register('telephone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us more about your inquiry..."
              rows={4}
              className={`resize-none ${errors.message ? 'border-red-500' : ''}`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Honeypot field - hidden from users */}
          <div className="hidden">
            <Input
              {...register('website')}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {submitStatus === 'success' && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for contacting us! We'll get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {cooldownRemaining > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please wait {cooldownRemaining} seconds before submitting again.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting || cooldownRemaining > 0}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          * Required fields
        </p>
      </div>
    </section>
  );
};

export default ContactForm;