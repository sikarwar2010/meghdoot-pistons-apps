'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { MessageSquare, Send, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const submit = useMutation(api.contacts.submit);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    try {
      await submit(data);
      toast.success("Message sent! We'll get back to you shortly.");
      reset();
      setSubmitted(true);
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 fade-up">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Contact
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Get In Touch</h1>
        <p className="text-muted-foreground">
          Have a technical question or need help finding the right part? Our
          team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 md:grid-cols-3">
        {/* Info */}
        <div className="space-y-6">
          {[
            {
              icon: Mail,
              label: 'Email',
              value: 'meghdootpistons@gmail.com',
              href: 'mailto:meghdootpistons@gmail.com',
            },
            {
              icon: Phone,
              label: 'Sales',
              value: '+91 97190 29044 \n +91 97604 15467 \n 0562 2990513',
              href: undefined,
            },
            {
              icon: FaWhatsapp,
              label: 'Chat with Mr Akash Agarwal',
              value: '+91 97190 29044',
              href: 'https://wa.me/919719029044',
            },
            {
              icon: FaWhatsapp,
              label: 'Chat with Mr Vishwas Agarwal',
              value: '+91 97604 15467',
              href: 'https://wa.me/919760415467',
            },
            {
              icon: MapPin,
              label: 'Address',
              value: ' 6 Industrial Estate, Nunhai,\nAgra (U.P.) - 282006',
              href: undefined,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/40 p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm hover:text-primary transition-colors whitespace-pre-line"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm whitespace-pre-line">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Message Received!</h2>
              <p className="text-muted-foreground mb-6">
                We'll respond to your inquiry within 1–2 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-xl border border-border/50 bg-card/40 p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name *
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Describe your part requirement or technical question…"
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all amber-glow"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
