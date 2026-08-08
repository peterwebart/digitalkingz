'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelValue = () => {
  const { data, rowNumber } = useRowLabel<{ value?: string; label?: string }>()
  const fallback = `Stat ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const label = [data?.value?.trim(), data?.label?.trim()].filter(Boolean).join(' — ')
  return <span>{label || fallback}</span>
}

export default RowLabelValue
