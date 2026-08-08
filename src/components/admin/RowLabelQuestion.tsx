'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabelQuestion = () => {
  const { data, rowNumber } = useRowLabel<{ question?: string }>()
  const fallback = `Question ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return <span>{data?.question?.trim() || fallback}</span>
}

export default RowLabelQuestion
