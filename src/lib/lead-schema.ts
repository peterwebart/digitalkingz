import { z } from 'zod'
import {
  BUDGET_OPTIONS,
  BUDGET_VALUES,
  SERVICE_INTEREST_OPTIONS,
  SERVICE_INTEREST_VALUES,
  TIMELINE_OPTIONS,
  TIMELINE_VALUES,
} from '@/collections/Leads'

/** Never blocks a submission: an invalid value becomes undefined. */
const attribution = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .catch(() => undefined)

/**
 * Single validation contract, shared by the client form and the server action.
 * The client uses it for inline feedback; the server treats every submission
 * as untrusted and re-validates from scratch.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.email('Please enter a valid email address').max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(''))
    .refine((v) => {
      if (!v) return true
      // Validate the digits, not the punctuation. The previous rule required
      // the first character to be "+" or a digit, which rejected the single
      // most common North American format, "(514) 555-0142" — including the
      // value iOS and Android autofill insert.
      if (!/^\+?[\d\s().\-]+$/.test(v)) return false
      const digits = v.replace(/\D/g, '')
      return digits.length >= 7 && digits.length <= 15
    }, 'Please enter a valid phone number'),
  company: z.string().trim().min(2, 'Please enter your business name').max(160),
  website: z.string().trim().max(200).optional().or(z.literal('')),
  industry: z.string().trim().max(120).optional().or(z.literal('')),
  services: z.array(z.enum(SERVICE_INTEREST_VALUES)).default([]),
  budget: z.enum(BUDGET_VALUES).optional().or(z.literal('')),
  timeline: z.enum(TIMELINE_VALUES).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a little more so the first call is useful')
    .max(5000),
  consent: z.literal(true, { error: 'Please confirm you are happy for us to reply' }),

  // Hidden fields. `botField` is a honeypot: real users never fill it.
  botField: z.string().max(0, 'Submission rejected').optional().or(z.literal('')),

  // Attribution. Every one of these is best-effort telemetry, so a malformed
  // or oversized value is silently discarded rather than allowed to reject an
  // otherwise valid enquiry. Losing a UTM is cheap. Losing a lead is not.
  sourcePath: attribution(300),
  referrer: attribution(500),
  utmSource: attribution(200),
  utmMedium: attribution(200),
  utmCampaign: attribution(200),
  utmTerm: attribution(200),
  utmContent: attribution(200),
  gclid: attribution(200),
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<keyof LeadInput, string>>
  /**
   * What the visitor typed, echoed back so a failed submission does not empty
   * the form. React 19 resets an uncontrolled form after any action completes,
   * success or failure, so the values have to come back from the server for
   * the fields to repopulate. Never includes the honeypot.
   */
  values?: Partial<Record<string, string | string[]>>
  /** Increments per failed attempt so the fields remount with fresh defaults. */
  attempt?: number
}

export const BUDGET_CHOICES = BUDGET_OPTIONS.map(({ label, value }) => ({ label, value }))
export const TIMELINE_CHOICES = TIMELINE_OPTIONS.map(({ label, value }) => ({ label, value }))
export const SERVICE_CHOICES = SERVICE_INTEREST_OPTIONS.map(({ label, value }) => ({
  label,
  value,
}))
