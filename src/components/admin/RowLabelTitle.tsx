'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelTitle = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  const fallback = `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return <span>{data?.title?.trim() || fallback}</span>
}

export default RowLabelTitle
