'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SERVICES, TOREKULL } from '@/lib/torekull';
import { cn } from '@/lib/utils';

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), 'Other'] as const;

const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().min(1, 'Please enter your email').email('Enter a valid email'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Select a focus area'),
  message: z.string().min(1, 'Tell us about your project'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

const underlineInput =
  'border-0 border-b border-border bg-transparent shadow-none rounded-none px-0 py-2.5 h-auto min-h-0 text-base md:text-sm w-full outline-none transition-[border-color,box-shadow,color] duration-200 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-0 placeholder:uppercase placeholder:text-muted-foreground/60 placeholder:text-xs placeholder:tracking-[0.08em]';

const underlineSelectWrap = 'relative';

function buildMailto(values: ContactFormValues) {
  const subject = encodeURIComponent(`Inquiry · ${values.service}`);
  const body = encodeURIComponent(
    [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      `Focus: ${values.service}`,
      '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n'),
  );
  return `mailto:${TOREKULL.email}?subject=${subject}&body=${body}`;
}

export function ContactForm() {
  const fieldIds = {
    name: 'contact-name',
    email: 'contact-email',
    phone: 'contact-phone',
    service: 'contact-service',
    message: 'contact-message',
  } as const;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    },
  });

  function onSubmit(values: ContactFormValues) {
    if (typeof window === 'undefined') return;
    window.location.href = buildMailto(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-8 gap-y-9 md:grid-cols-6 md:gap-y-10"
      noValidate
    >
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={fieldIds.name} className="nav-caps text-xs font-medium text-muted-foreground">
          Name
          <span className="text-muted-foreground/70" aria-hidden>
            *
          </span>
        </Label>
        <input
          id={fieldIds.name}
          type="text"
          autoComplete="name"
          className={cn(underlineInput, errors.name && 'border-destructive')}
          placeholder="YOUR NAME"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id={`${fieldIds.name}-error`} className="text-destructive text-xs">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={fieldIds.email} className="nav-caps text-xs font-medium text-muted-foreground">
          Email
          <span className="text-muted-foreground/70" aria-hidden>
            *
          </span>
        </Label>
        <input
          id={fieldIds.email}
          type="email"
          autoComplete="email"
          className={cn(underlineInput, errors.email && 'border-destructive')}
          placeholder="YOUR EMAIL"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id={`${fieldIds.email}-error`} className="text-destructive text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={fieldIds.phone} className="nav-caps text-xs font-medium text-muted-foreground">
          Phone
        </Label>
        <input
          id={fieldIds.phone}
          type="tel"
          autoComplete="tel"
          className={underlineInput}
          placeholder="YOUR PHONE"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
      </div>

      <div className={cn('space-y-2 md:col-span-2', underlineSelectWrap)}>
        <Label htmlFor={fieldIds.service} className="nav-caps text-xs font-medium text-muted-foreground">
          Focus
          <span className="text-muted-foreground/70" aria-hidden>
            *
          </span>
        </Label>
        <div className="relative">
          <select
            id={fieldIds.service}
            className={cn(
              underlineInput,
              'cursor-pointer appearance-none pr-8',
              errors.service && 'border-destructive',
            )}
            defaultValue=""
            required
            aria-required="true"
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? `${fieldIds.service}-error` : undefined}
            {...register('service')}
          >
            <option value="" disabled>
              SELECT FOCUS
            </option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 bottom-3 size-4 text-muted-foreground"
            aria-hidden
          />
        </div>
        {errors.service && (
          <p id={`${fieldIds.service}-error`} className="text-destructive text-xs">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="space-y-2 md:col-span-6">
        <Label htmlFor={fieldIds.message} className="nav-caps text-xs font-medium text-muted-foreground">
          Message
          <span className="text-muted-foreground/70" aria-hidden>
            *
          </span>
        </Label>
        <textarea
          id={fieldIds.message}
          rows={5}
          className={cn(
            'border-0 border-b border-border bg-transparent shadow-none rounded-none px-0 py-2 min-h-28 resize-y w-full outline-none transition-colors focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-0 placeholder:uppercase placeholder:text-muted-foreground/60 placeholder:text-xs placeholder:tracking-[0.08em] text-base md:text-sm',
            errors.message && 'border-destructive',
          )}
          placeholder="DESCRIBE YOUR PROJECT, TIMELINE, AND LOCATION"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id={`${fieldIds.message}-error`} className="text-destructive text-xs">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="md:col-span-6 flex justify-start pt-2">
        <Button type="submit" variant="ghost" size="lg" className="group -ml-3 gap-2 px-3 font-medium">
          Send inquiry
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
