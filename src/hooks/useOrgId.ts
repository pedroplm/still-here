import { useAuth } from '@/contexts/AuthContext'
import { useOrganization } from './useOrganization'

export function useOrgId() {
  const { user } = useAuth()
  const { org, loading } = useOrganization()
  return { orgId: user ? org?.organizationId : undefined, loading: Boolean(user) && loading }
}
