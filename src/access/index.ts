import type { Access, FieldAccess } from 'payload'

/** Public read. Used for every published content collection. */
export const anyone: Access = () => true

/** Any signed-in admin user. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedFieldAccess: FieldAccess = ({ req: { user } }) => Boolean(user)

/**
 * Signed-in users see everything. The public only sees published documents.
 * Applied to collections that use drafts.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Nobody, via the API. Used for fields written only by server-side hooks. */
export const noone: Access = () => false
