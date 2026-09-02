import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getOrganizationByUserId } from '@/services/database.service'

export function useOrgId() {
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getOrganizationByUserId(user.uid)
      .then((org) => setOrgId(org?.organizationId))
      .finally(() => setLoading(false))
  }, [user])

  return { orgId, loading }
}
