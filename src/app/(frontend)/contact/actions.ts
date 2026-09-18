'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { scoreLead } from '@/collections/Leads'
import { env, envOr } from '@/lib/env'
import {
  BUDGET_CHOICES,
  SERVICE_CHOICES,
  TIMELINE_CHOICES,
  leadSchema,
  type LeadFormState,
  type LeadInput,
} from '@/lib/lead-schema'
import { getPayloadClient } from '@/lib/payload'

/**
 * In-memory rate limit.
 *
 * Enough to stop a naive script hammering the form from one address. It resets
 * on deploy, which is acceptable: the honeypot and validation carry the real
 * weight, and anything more aggressive belongs at the edge, not in app code.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const attempts = new Map<string, number[]>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  attempts.set(key, recent)

  if (attempts.size > 5000) {
    for (const [k, times] of attempts) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) attempts.delete(k)
    }
  }
  return recent.length > RATE_MAX
}

const label = (
  choices: readonly { label: string; value: string }[],
  value?: string | null,
): string => choices.find((c) => c.value === value)?.label ?? 'Not specified'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderEmail(data: LeadInput, score: number): string {
  const rows: [string, string][] = [
    ['Score', `${score} / 100`],
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || 'Not provided'],
    ['Business', data.company],
    ['Website', data.website || 'Not provided'],
    ['Industry', data.industry || 'Not specified'],
    [
      'Services',
      data.services.length
        ? data.services.map((s) => label(SERVICE_CHOICES, s)).join(', ')
        : 'Not specified',
    ],
    ['Budget', label(BUDGET_CHOICES, data.budget)],
    ['Timeline', label(TIMELINE_CHOICES, data.timeline)],
    ['Source page', data.sourcePath || 'Unknown'],
    ['Referrer', data.referrer || 'Direct'],
    [
      'Campaign',
      [data.utmSource, data.utmMedium, data.utmCampaign].filter(Boolean).join(' / ') || 'None',
    ],
  ]

  return `<!doctype html><html><body style="margin:0;background:#0d0f13;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:#d5d8dd">
<div style="max-width:640px;margin:0 auto;padding:32px 24px">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a227">Digital Kingz</p>
  <h1 style="margin:0 0 24px;font-size:22px;color:#f5f6f7">New enquiry &middot; ${esc(data.company)}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:9px 0;border-bottom:1px solid #1c1f26;color:#8b9099;width:34%;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid #1c1f26;color:#e7e9ec">${esc(v)}</td></tr>`,
      )
      .join('')}
  </table>
  <h2 style="margin:28px 0 8px;font-size:14px;color:#8b9099;font-weight:500">Project description</h2>
  <p style="margin:0;padding:16px;background:#14171c;border-radius:10px;font-size:14px;line-height:1.65;white-space:pre-wrap;color:#d5d8dd">${esc(data.message)}</p>
  <p style="margin:28px 0 0;font-size:12px;color:#6b7280">Reply directly to this email to reach ${esc(data.name)}.</p>
</div></body></html>`
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // FormData.get returns null for any field the browser did not send, and the
  // hidden attribution inputs only render when a campaign parameter is present.
  // Zod's .optional() accepts undefined but not null, so normalise first.
  const str = (key: string): string | undefined => {
    const value = formData.get(key)
    return typeof value === 'string' ? value : undefined
  }

  const raw = {
    name: str('name'),
    email: str('email'),
    phone: str('phone'),
    company: str('company'),
    website: str('website'),
    industry: str('industry'),
    services: formData.getAll('services').filter((v): v is string => typeof v === 'string'),
    budget: str('budget'),
    timeline: str('timeline'),
    message: str('message'),
    consent: str('consent') === 'on' || str('consent') === 'true',
    botField: str('botField'),
    sourcePath: str('sourcePath'),
    referrer: str('referrer'),
    utmSource: str('utmSource'),
    utmMedium: str('utmMedium'),
    utmCampaign: str('utmCampaign'),
    utmTerm: str('utmTerm'),
    utmContent: str('utmContent'),
    gclid: str('gclid'),
  }

  // Echoed back on failure so the visitor does not retype everything. The
  // honeypot is deliberately excluded.
  const submitted: LeadFormState['values'] = {
    name: raw.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    company: raw.company ?? '',
    website: raw.website ?? '',
    industry: raw.industry ?? '',
    services: raw.services,
    budget: raw.budget ?? '',
    timeline: raw.timeline ?? '',
    message: raw.message ?? '',
    consent: raw.consent ? 'on' : '',
  }

  const parsed = leadSchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: LeadFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput | undefined
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return {
      status: 'error',
      message: 'Please check the highlighted fields and try again.',
      fieldErrors,
      values: submitted,
      attempt: (_prev.attempt ?? 0) + 1,
    }
  }

  const data = parsed.data

  // Honeypot: respond as if successful so a bot learns nothing.
  if (data.botField) {
    return { status: 'success', message: 'Thank you. We will be in touch shortly.' }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return {
      status: 'error',
      message:
        'That is a few submissions in a short window. Please email us directly and we will pick it up from there.',
      values: submitted,
      attempt: (_prev.attempt ?? 0) + 1,
    }
  }

  const score = scoreLead({
    budget: data.budget || null,
    timeline: data.timeline || null,
    website: data.website || null,
    company: data.company,
    message: data.message,
    services: data.services,
    phone: data.phone || null,
  })

  let leadId: number | string | null = null
  const deliveryNotes: string[] = []

  // 1. Persist first. The lead must survive even if email and webhook fail.
  try {
    const payload = await getPayloadClient()
    const created = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        status: 'new',
        score,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company,
        website: data.website || undefined,
        industry: data.industry || undefined,
        services: data.services,
        budget: data.budget || undefined,
        timeline: data.timeline || undefined,
        message: data.message,
        sourcePath: data.sourcePath || undefined,
        referrer: data.referrer || undefined,
        utmSource: data.utmSource || undefined,
        utmMedium: data.utmMedium || undefined,
        utmCampaign: data.utmCampaign || undefined,
        utmTerm: data.utmTerm || undefined,
        utmContent: data.utmContent || undefined,
        gclid: data.gclid || undefined,
      },
    })
    leadId = created.id
  } catch (error) {
    console.error('[lead] Failed to persist lead', error)
    return {
      status: 'error',
      message:
        'Something went wrong on our end and we did not want to pretend otherwise. Please email us directly and we will reply the same day.',
      values: submitted,
      attempt: (_prev.attempt ?? 0) + 1,
    }
  }

  // 2. Notify by email.
  let notificationSent = false
  const resendKey = env('RESEND_API_KEY')
  const to = envOr('LEAD_EMAIL_TO', '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // Resend returns API errors in the response body rather than throwing, so the
  // rejection branch is the one that matters and it used to log nothing. Every
  // branch logs now. Never logs the key, the mailbox or the recipients — only
  // the sender domain, which is the usual culprit.
  const from = env('LEAD_EMAIL_FROM')
  const senderDomain = from?.match(/@([^\s>]+)/)?.[1] ?? 'none'
  const missing = [
    !resendKey && 'RESEND_API_KEY',
    !from && 'LEAD_EMAIL_FROM',
    to.length === 0 && 'LEAD_EMAIL_TO',
  ].filter(Boolean) as string[]

  if (missing.length > 0) {
    // The previous fallback sender, onboarding@resend.dev, only delivers to the
    // Resend account owner, so a missing sender produced a 403 that looked like
    // a code fault. A missing sender is a configuration error, reported as one.
    const note = `Email skipped: ${missing.join(', ')} not configured.`
    deliveryNotes.push(note)
    console.error(`[lead] ${note} Lead ${leadId} saved but not emailed.`)
  } else {
    console.info(
      `[lead] Sending notification for lead ${leadId} via Resend. ` +
        `senderDomain=${senderDomain} recipients=${to.length}`,
    )
    try {
      const resend = new Resend(resendKey)
      const result = await resend.emails.send({
        from: from as string,
        to,
        replyTo: data.email,
        subject: `New enquiry (${score}/100) - ${data.company}`,
        html: renderEmail(data, score),
      })
      if (result.error) {
        const { name, message } = result.error
        deliveryNotes.push(`Email failed: ${name}: ${message}`)
        console.error(
          `[lead] Resend rejected the send. name=${name} message=${message} senderDomain=${senderDomain}`,
        )
      } else {
        notificationSent = true
        console.info(`[lead] Resend accepted the send. id=${result.data?.id ?? 'unknown'}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error'
      deliveryNotes.push(`Email threw: ${message}`)
      console.error(`[lead] Resend call threw before a response. message=${message}`)
    }
  }

  // 3. Forward to the CRM / automation platform.
  let webhookDelivered = false
  const webhookUrl = env('CRM_WEBHOOK_URL')

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env('CRM_WEBHOOK_SECRET')
            ? { 'X-Webhook-Secret': env('CRM_WEBHOOK_SECRET') as string }
            : {}),
        },
        body: JSON.stringify({
          event: 'lead.created',
          leadId,
          score,
          submittedAt: new Date().toISOString(),
          contact: {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company,
            website: data.website || null,
          },
          brief: {
            industry: data.industry || null,
            services: data.services,
            budget: data.budget || null,
            timeline: data.timeline || null,
            message: data.message,
          },
          attribution: {
            sourcePath: data.sourcePath || null,
            referrer: data.referrer || null,
            utmSource: data.utmSource || null,
            utmMedium: data.utmMedium || null,
            utmCampaign: data.utmCampaign || null,
            utmTerm: data.utmTerm || null,
            utmContent: data.utmContent || null,
            gclid: data.gclid || null,
          },
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (response.ok) {
        webhookDelivered = true
      } else {
        deliveryNotes.push(`Webhook returned ${response.status}.`)
      }
    } catch (error) {
      deliveryNotes.push(
        `Webhook threw: ${error instanceof Error ? error.message : 'unknown error'}`,
      )
      console.error('[lead] CRM webhook failed', error)
    }
  } else {
    deliveryNotes.push('Webhook skipped: CRM_WEBHOOK_URL not configured.')
  }

  // 4. Record delivery outcome against the lead.
  if (leadId !== null) {
    try {
      const payload = await getPayloadClient()
      await payload.update({
        collection: 'leads',
        id: leadId,
        overrideAccess: true,
        data: {
          notificationSent,
          webhookDelivered,
          deliveryNotes: deliveryNotes.length > 0 ? deliveryNotes.join('\n') : undefined,
        },
      })
    } catch (error) {
      console.error('[lead] Failed to record delivery status', error)
    }
  }

  return {
    status: 'success',
    message:
      'Received. We read every enquiry personally and will reply within one business day with either a time to talk or an honest reason we are not the right fit.',
  }
}
