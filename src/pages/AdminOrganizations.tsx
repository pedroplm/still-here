import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminUid } from '@/services/admin'
import { getOrganizationsByStatus, setOrganizationStatus } from '@/services/database.service'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Organization, OrgStatus } from '@/types'

type Tab = OrgStatus

const TABS: { key: Tab; label: string }[] = [
  { key: 'pending', label: 'Pendentes' },
  { key: 'approved', label: 'Aprovadas' },
  { key: 'rejected', label: 'Rejeitadas' },
]

function formatDate(ts?: { toDate: () => Date }) {
  return ts ? ts.toDate().toLocaleDateString('pt-BR') : '—'
}

export default function AdminOrganizations() {
  usePageMeta('Aprovação de ONGs · Still Here')
  const { user } = useAuth()
  const isAdmin = isAdminUid(user?.uid)

  const [tab, setTab] = useState<Tab>('pending')
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string>()
  const [rejectingId, setRejectingId] = useState<string>()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    getOrganizationsByStatus(tab)
      .then((data) => {
        if (cancelled) return
        setOrgs(data)
        setError('')
      })
      .catch(() => {
        if (cancelled) return
        setError('Não foi possível carregar as ONGs. Verifique as permissões do Firestore.')
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
    setError('')
    try {
      await setOrganizationStatus(org.id, 'approved')
      setOrgs((prev) => prev.filter((o) => o.id !== org.id))
    } catch {
      setError('Falha ao aprovar. As regras do Firestore podem não permitir a escrita pelo admin.')
    } finally {
      setBusyId(undefined)
    }
  }

  async function handleReject(org: Organization) {
    if (!org.id) return
    setBusyId(org.id)
    setError('')
    try {
      await setOrganizationStatus(org.id, 'rejected', reason.trim())
      setOrgs((prev) => prev.filter((o) => o.id !== org.id))
      setRejectingId(undefined)
      setReason('')
    } catch {
      setError('Falha ao rejeitar. As regras do Firestore podem não permitir a escrita pelo admin.')
    } finally {
      setBusyId(undefined)
    }
  }

  if (!user) return null

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso restrito</h1>
        <p className="text-gray-500">Esta área é exclusiva da curadoria.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Aprovação de ONGs</h1>
      <p className="text-gray-500 mb-6">
        Confirme que a ONG existe de verdade antes de liberar o acesso ao painel.
      </p>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setLoading(true)
              setTab(t.key)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : orgs.length === 0 ? (
        <p className="text-gray-500">Nenhuma ONG nesta lista.</p>
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
                        aguardando
                      </span>
                    )}
                    {org.status === 'rejected' && (
                      <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        rejeitada
                      </span>
                    )}
                    {org.status === 'approved' && (
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        aprovada
                      </span>
                    )}
                  </div>

                  <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">CNPJ</dt>
                      <dd className="text-gray-700">{org.cnpj || '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">Cidade</dt>
                      <dd className="text-gray-700">
                        {org.city}/{org.state}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">E-mail</dt>
                      <dd className="text-gray-700 truncate">{org.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">Telefone</dt>
                      <dd className="text-gray-700">{org.phone || '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">Instagram</dt>
                      <dd className="text-gray-700">{org.instagram || '—'}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-20 shrink-0">Enviado</dt>
                      <dd className="text-gray-700">{formatDate(org.createdAt)}</dd>
                    </div>
                  </dl>

                  {org.rejectionReason && (
                    <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                      Motivo da rejeição: {org.rejectionReason}
                    </p>
                  )}

                  {org.status === 'pending' && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleApprove(org)}
                        disabled={busyId === org.id}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(rejectingId === org.id ? undefined : org.id)
                          setReason('')
                        }}
                        disabled={busyId === org.id}
                        className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}

                  {rejectingId === org.id && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo da rejeição
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                        placeholder="Ex: CNPJ não encontrado na Receita Federal"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleReject(org)}
                        disabled={busyId === org.id || !reason.trim()}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirmar rejeição
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
                        Aprovar mesmo assim
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
