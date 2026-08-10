'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, ArrowRight, Check, Loader2 } from 'lucide-react'
import { submitLead } from '@/app/(frontend)/contact/actions'
import {
  BUDGET_CHOICES,
  SERVICE_CHOICES,
  TIMELINE_CHOICES,
  type LeadFormState,
} from '@/lib/lead-schema'
import { cn } from '@/lib/utils'

const initialState: LeadFormState = { status: 'idle' }

const UTM_KEYS = [
  ['utmSource', 'utm_source'],
  ['utmMedium', 'utm_medium'],
  ['utmCampaign', 'utm_campaign'],
  ['utmTerm', 'utm_term'],
  ['utmContent', 'utm_content'],
  ['gclid', 'gclid'],
] as const

export function ContactForm() {
  const [state, formAction] = useActionState(submitLead, initialState)
  const [attribution, setAttribution] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const next: Record<string, string> = {
      sourcePath: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
    }
    for (const [field, param] of UTM_KEYS) {
      const value = params.get(param)
      if (value) next[field] = value
    }
    setAttribution(next)
  }, [])

  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-5 rounded-2xl border border-brand-500/25 bg-brand-500/[0.04] p-8 outline-none md:p-10"
      >
        <span className="flex size-12 items-center justify-center rounded-full border border-brand-500/30 bg-brand-500/10">
          <Check className="size-6 text-brand-400" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className="text-display-sm">Enquiry received</h2>
        <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-300">{state.message}</p>
        <p className="text-sm text-ink-500">
          In the meantime,{' '}
          <Link
            href="/growth-hub/lead-to-revenue-system"
            className="text-brand-400 hover:text-brand-300"
          >
            this article
          </Link>{' '}
          covers the framework we will use in the first call.
        </p>
      </div>
    )
  }

  const v = state.values

  return (
    // `key` changes on each failed attempt. React 19 resets an uncontrolled
    // form after every action, so the fields have to remount to pick up the
    // defaults the server just echoed back — otherwise a rejected submission
    // wipes everything the visitor typed.
    <form
      key={state.attempt ?? 0}
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-8"
      noValidate
    >
      {Object.entries(attribution).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {/* Honeypot. Hidden from users, visible to naive bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="botField">Do not fill this in</label>
        <input id="botField" name="botField" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && state.message ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.06] p-4 outline-none"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-red-400"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-sm text-red-200">{state.message}</p>
        </div>
      ) : null}

      <Fieldset legend="About you" step="01">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Your name"
            name="name"
            defaultValue={v?.name as string | undefined}
            required
            autoComplete="name"
            error={state.fieldErrors?.name}
          />
          <Field
            label="Email"
            name="email"
            defaultValue={v?.email as string | undefined}
            type="email"
            required
            autoComplete="email"
            error={state.fieldErrors?.email}
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={v?.phone as string | undefined}
            error={state.fieldErrors?.phone}
          />
          <Field
            label="Business name"
            name="company"
            defaultValue={v?.company as string | undefined}
            required
            autoComplete="organization"
            error={state.fieldErrors?.company}
          />
          <Field
            label="Current website"
            name="website"
            defaultValue={v?.website as string | undefined}
            placeholder="example.com"
            autoComplete="url"
            error={state.fieldErrors?.website}
            hint="Leave blank if you do not have one yet."
          />
          <Field
            label="Industry"
            name="industry"
            defaultValue={v?.industry as string | undefined}
            placeholder="e.g. dental, HVAC, SaaS"
            error={state.fieldErrors?.industry}
          />
        </div>
      </Fieldset>

      <Fieldset legend="What you need" step="02">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-medium text-ink-200">
            Which areas are you looking at?
          </legend>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CHOICES.map((choice) => (
              <label
                key={choice.value}
                className="group cursor-pointer select-none rounded-full border border-ink-100/10 px-4 py-2 text-sm text-ink-400 transition-colors has-checked:border-brand-500/45 has-checked:bg-brand-500/[0.08] has-checked:text-brand-200 hover:border-ink-100/25"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={choice.value}
                  defaultChecked={
                    Array.isArray(v?.services) && v.services.includes(choice.value)
                  }
                  className="sr-only"
                />
                {choice.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Approximate budget"
            name="budget"
            defaultValue={(v?.budget as string) ?? ''}
            options={BUDGET_CHOICES}
            error={state.fieldErrors?.budget}
            hint="A range is fine. It tells us what is realistic to propose."
          />
          <Select
            label="Timeline"
            name="timeline"
            defaultValue={(v?.timeline as string) ?? ''}
            options={TIMELINE_CHOICES}
            error={state.fieldErrors?.timeline}
          />
        </div>
      </Fieldset>

      <Fieldset legend="The brief" step="03">
        <Field
          as="textarea"
          label="What are you trying to fix or build?"
          name="message"
          defaultValue={v?.message as string | undefined}
          required
          rows={7}
          error={state.fieldErrors?.message}
          placeholder="The more specific the better. What does a customer become worth to you? Where does the pipeline currently stall? What have you already tried?"
          hint="If you know your average customer value and current cost per lead, include them. It makes the first call far more useful."
        />
      </Fieldset>

      <div className="flex flex-col gap-5 border-t border-ink-100/8 pt-7">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={v?.consent === 'on'}
            className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-ink-100/20 bg-ink-100/[0.03] checked:border-brand-500 checked:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          />
          <span className="text-sm leading-relaxed text-ink-400">
            I am happy for Digital Kingz to contact me about this enquiry. We do not sell or share
            your details, and there is no mailing list attached to this form.
          </span>
        </label>
        {state.fieldErrors?.consent ? (
          <p className="text-sm text-red-400">{state.fieldErrors.consent}</p>
        ) : null}

        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-base font-medium text-ink-950 transition-all duration-300 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
          Sending
        </>
      ) : (
        <>
          Send enquiry
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </>
      )}
    </button>
  )
}

function Fieldset({
  legend,
  step,
  children,
}: {
  legend: string
  step: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">{step}</span>
        <h2 className="text-sm font-medium text-ink-100">{legend}</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-ink-100/8" />
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

const inputBase =
  'w-full rounded-xl border bg-ink-100/[0.03] px-4 py-3 text-[0.9375rem] text-ink-100 outline-none transition-colors duration-200 placeholder:text-ink-600 focus:border-brand-500/50 focus:bg-ink-100/[0.05]'

function Field({
  label,
  name,
  as,
  error,
  hint,
  required,
  ...props
}: {
  label: string
  name: string
  as?: 'textarea'
  error?: string
  hint?: string
  required?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `field-${name}`
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('flex flex-col gap-2', as === 'textarea' && 'sm:col-span-2')}>
      <label htmlFor={id} className="text-sm font-medium text-ink-200">
        {label}
        {required ? (
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-ink-600">optional</span>
        )}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(inputBase, 'resize-y leading-relaxed', error ? 'border-red-500/50' : 'border-ink-100/10')}
          {...props}
        />
      ) : (
        <input
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(inputBase, error ? 'border-red-500/50' : 'border-ink-100/10')}
          {...props}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-ink-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Select({
  label,
  name,
  options,
  error,
  hint,
  defaultValue = '',
}: {
  label: string
  name: string
  options: { label: string; value: string }[]
  error?: string
  hint?: string
  defaultValue?: string
}) {
  const id = `field-${name}`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-200">
        {label}
        <span className="ml-2 text-xs font-normal text-ink-600">optional</span>
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        className={cn(
          inputBase,
          'cursor-pointer appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10',
          error ? 'border-red-500/50' : 'border-ink-100/10',
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-900">
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-xs leading-relaxed text-ink-600">{hint}</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
