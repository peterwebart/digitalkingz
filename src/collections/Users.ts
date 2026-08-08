import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'updatedAt'],
    group: 'Settings',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 10,
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
