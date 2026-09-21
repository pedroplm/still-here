import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getOrganizationByUserId } from '@/services/database.service'

export function useOrgId() {
  const { user } = useAuth()
  const [orgId, setOrgId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getOrganizationByUserId(user.uid).then((org) => {
      if (!cancelled) setOrgId(org?.organizationId)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  return { orgId: user ? orgId : undefined, loading: Boolean(user) && orgId === undefined }
}
