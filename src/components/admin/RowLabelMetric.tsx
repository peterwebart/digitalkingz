'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelMetric = () => {
  const { data, rowNumber } = useRowLabel<{ metric?: string; value?: string }>()
  const fallback = `Result ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const label = [data?.metric?.trim(), data?.value?.trim()].filter(Boolean).join(' — ')
  return <span>{label || fallback}</span>
}

export default RowLabelMetric
