import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminUid } from '@/services/admin'
import { getOrganizationsByStatus, setOrganizationStatus, hideOrganizationAnimals } from '@/services/database.service'
import { maskCnpj } from '@/services/cnpj'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Organization, OrgStatus } from '@/types'

type Tab = OrgStatus

const TABS = [
  { key: 'pending', label: 'adminOrgs.tabPending' },
  { key: 'approved', label: 'adminOrgs.tabApproved' },
  { key: 'rejected', label: 'adminOrgs.tabRejected' },
] as const satisfies readonly { key: Tab; label: string }[]

function formatDate(ts: { toDate: () => Date } | undefined, locale: string) {
  return ts ? ts.toDate().toLocaleDateString(locale) : '—'
}

export default function AdminOrganizations() {
  const { t, i18n } = useTranslation()
  usePageMeta(t('adminOrgs.meta.title'))
  const { user } = useAuth()
  const isAdmin = isAdminUid(user?.uid)

  const [tab, setTab] = useState<Tab>('pending')
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string>()
  const [rejectingId, setRejectingId] = useState<string>()
  const [reason, setReason] = useState('')
  const [failed, setFailed] = useState(false)
  const [actionFailed, setActionFailed] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    getOrganizationsByStatus(tab)
      .then((data) => {
        if (cancelled) return
        setOrgs(data)
        setFailed(false)
      })
      .catch(() => {
        if (cancelled) return
        setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isAdmin, tab])

  async function handleApprove(org: Organization) {
    if (!org.id) return
    setBusyId(org.id)
    setActionFailed(false)
    try {
      await setOrganizationStatus(org.id, 'approved')
      setOrgs((prev) => prev.filter((o) => o.id !== org.id))
    } catch {
      setActionFailed(true)
    } finally {
      setBusyId(undefined)
    }
  }

  async function handleReject(org: Organization) {
    if (!org.id) return
    setBusyId(org.id)
    setActionFailed(false)
    try {
      await setOrganizationStatus(org.id, 'rejected', reason.trim())
      await hideOrganizationAnimals(org.id)
      setOrgs((prev) => prev.filter((o) => o.id !== org.id))
      setRejectingId(undefined)
      setReason('')
    } catch {
      setActionFailed(true)
    } finally {
      setBusyId(undefined)
    }
  }

  if (!user) return null

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('adminOrgs.restrictedTitle')}</h1>
        <p className="text-gray-500">{t('adminOrgs.restrictedBody')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('adminOrgs.h1')}</h1>
      <p className="text-gray-500 mb-6">{t('adminOrgs.subtitle')}</p>

      <div className="flex gap-2 mb-6">
        {TABS.map((entry) => (
          <button
            key={entry.key}
            onClick={() => {
              setLoading(true)
              setTab(entry.key)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === entry.key
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t(entry.label)}
          </button>
        ))}
      </div>

      {failed && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{t('adminOrgs.loadError')}</div>
      )}
      {actionFailed && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{t('adminOrgs.actionError')}</div>
      )}

      {loading ? (
        <p className="text-gray-400">{t('common.loading')}</p>
      ) : orgs.length === 0 ? (
        <p className="text-gray-500">{t('adminOrgs.empty')}</p>
      ) : (
        <div className="space-y-4">
          {orgs.map((org) => {
            if (!org.id) return null
            return (
            <div key={org.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                      {org.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">{org.name}</h2>
                    {org.status === 'pending' && (
                      <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {t('adminOrgs.badgeWaiting')}
                      </span>
                    )}
                    {org.status === 'rejected' && (
                      <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        {t('adminOrgs.badgeRejected')}
                      </span>
                    )}
                    {org.status === 'approved' && (
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {t('adminOrgs.badgeApproved')}
                      </span>
                    )}
                  </div>

                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">CNPJ</dt>
                      <dd className="text-gray-700">{org.cnpj ? maskCnpj(org.cnpj) : '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">{t('orgProfile.city')}</dt>
                      <dd className="text-gray-700">
                        {org.city}/{org.state}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">{t('register.email')}</dt>
                      <dd className="text-gray-700 truncate">{org.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">{t('adminOrgs.phone')}</dt>
                      <dd className="text-gray-700">{org.phone || '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">Instagram</dt>
                      <dd className="text-gray-700">{org.instagram || '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">{t('adminOrgs.submitted')}</dt>
                      <dd className="text-gray-700">{formatDate(org.createdAt, i18n.resolvedLanguage ?? 'pt-BR')}</dd>
                    </div>
                  </dl>

                  {org.rejectionReason && (
                    <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                      {t('adminOrgs.rejectionReason', { reason: org.rejectionReason })}
                    </p>
                  )}

                  {org.status === 'pending' && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleApprove(org)}
                        disabled={busyId === org.id}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {t('adminOrgs.approve')}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(rejectingId === org.id ? undefined : org.id)
                          setReason('')
                        }}
                        disabled={busyId === org.id}
                        className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                      >
                        {t('adminOrgs.reject')}
                      </button>
                    </div>
                  )}

                  {rejectingId === org.id && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('adminOrgs.reasonLabel')}
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        placeholder={t('adminOrgs.reasonPlaceholder')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleReject(org)}
                        disabled={busyId === org.id || !reason.trim()}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {t('adminOrgs.confirmReject')}
                      </button>
                    </div>
                  )}

                  {org.status === 'rejected' && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleApprove(org)}
                        disabled={busyId === org.id}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {t('adminOrgs.approveAnyway')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
