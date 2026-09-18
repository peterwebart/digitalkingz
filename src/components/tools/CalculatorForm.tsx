'use client'

import { useMemo, useState } from 'react'
import { getCalculator, type Field, type Result } from '@/lib/calculators'

/**
 * The one interactive component in the tool set.
 *
 * Recalculating on every keystroke is the whole point of a calculator, so this
 * is client-side — but it holds nothing except the field values, imports no
 * libraries, and the compute function comes from the definition. Adding a
 * twenty-first tool adds no JavaScript.
 */

function formatValue(value: number | string, format: Result['format']): string {
  if (typeof value === 'string') return value
  if (!Number.isFinite(value)) return '—'

  switch (format) {
    case 'currency':
      return value.toLocaleString(undefined, {
        style: 'currency', currency: 'USD', maximumFractionDigits: value >= 100 ? 0 : 2,
      })
    case 'percent':
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`
    case 'ratio':
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}:1`
    case 'months':
      return value <= 0 ? 'Never at these numbers' : `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} months`
    default:
      return value.toLocaleString(undefined, { maximumFractionDigits: 1 })
  }
}

/** Select fields carry a numeric factor; number fields carry themselves. */
function initialValues(fields: Field[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.name, String(f.default)]))
}

function resolve(fields: Field[], raw: Record<string, string>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const field of fields) {
    const value = raw[field.name]
    if (field.type === 'select') {
      out[field.name] = field.options?.find((o) => o.value === value)?.factor ?? 0
    } else {
      out[field.name] = Number(value) || 0
    }
  }
  return out
}

/**
 * Takes a slug rather than the calculator object: compute functions cannot
 * cross the server/client boundary. The definitions module is shared across all
 * twenty tool pages, so it is fetched once and cached rather than duplicated.
 */
export function CalculatorForm({ slug }: { slug: string }) {
  const calculator = getCalculator(slug)
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    calculator ? initialValues(calculator.fields) : {},
  )

  const results = useMemo(() => {
    if (!calculator) return []
    try {
      return calculator.compute(resolve(calculator.fields, raw))
    } catch {
      return []
    }
  }, [calculator, raw])

  if (!calculator) return null

  const set = (name: string, value: string) => setRaw((prev) => ({ ...prev, [name]: value }))

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <div className="surface-card flex flex-col gap-5 p-6 sm:p-8">
        {calculator.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label htmlFor={field.name} className="text-sm font-medium text-ink-100">
              {field.label}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                value={raw[field.name]}
                onChange={(e) => set(field.name, e.target.value)}
                className="rounded-lg border border-ink-100/12 bg-ink-950/50 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus-visible:border-brand-500/50"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                {field.type === 'currency' ? (
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                    $
                  </span>
                ) : null}
                <input
                  id={field.name}
                  type="number"
                  inputMode="decimal"
                  value={raw[field.name]}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={`w-full rounded-lg border border-ink-100/12 bg-ink-950/50 py-2.5 text-sm text-ink-100 outline-none focus-visible:border-brand-500/50 ${
                    field.type === 'currency' ? 'pl-7 pr-3.5' : 'px-3.5'
                  } ${field.type === 'percent' ? 'pr-9' : ''}`}
                />
                {field.type === 'percent' ? (
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                    %
                  </span>
                ) : null}
              </div>
            )}

            {field.help ? <p className="text-xs leading-relaxed text-ink-500">{field.help}</p> : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="surface-card flex flex-col gap-4 p-6" aria-live="polite">
          <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">Result</h2>
          <dl className="flex flex-col gap-3.5">
            {results.map((result) => (
              <div key={result.label} className="flex flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className={result.emphasis ? 'text-sm text-ink-200' : 'text-sm text-ink-500'}>
                    {result.label}
                  </dt>
                  <dd
                    className={
                      result.emphasis
                        ? 'text-right text-lg font-medium tabular-nums text-brand-300'
                        : 'text-right text-sm tabular-nums text-ink-100'
                    }
                  >
                    {formatValue(result.value, result.format)}
                  </dd>
                </div>
                {result.help ? <p className="text-xs leading-relaxed text-ink-600">{result.help}</p> : null}
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-ink-100/8 p-5">
          <h2 className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">How it works</h2>
          <p className="text-sm leading-relaxed text-ink-400">{calculator.formula}</p>
        </div>
      </div>
    </div>
  )
}
