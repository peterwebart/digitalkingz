'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelHeading = () => {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>()
  const fallback = `Section ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return <span>{data?.heading?.trim() || fallback}</span>
}

export default RowLabelHeading
