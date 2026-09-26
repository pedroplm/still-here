import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getOrganizationByUserId } from '@/services/database.service'
import type { Organization } from '@/types'

interface LoadedOrg {
  uid: string
  org: Organization | null
}

export function useOrganization() {
  const { user } = useAuth()
  const [loaded, setLoaded] = useState<LoadedOrg | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getOrganizationByUserId(user.uid).then((org) => {
      if (!cancelled) setLoaded({ uid: user.uid, org })
    })
    return () => {
      cancelled = true
    }
  }, [user])

  const isCurrent = loaded !== null && loaded.uid === user?.uid
  return {
    org: isCurrent ? loaded.org : null,
    loading: Boolean(user) && !isCurrent,
  }
}
