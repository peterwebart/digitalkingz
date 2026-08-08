'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelName = () => {
  const { data, rowNumber } = useRowLabel<{ name?: string }>()
  const fallback = `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return <span>{data?.name?.trim() || fallback}</span>
}

export default RowLabelName
