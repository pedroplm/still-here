import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getOrganizationByUserId,
  updateOrganization,
  type Organization,
} from '@/services/database.service'
import { uploadImage } from '@/services/storage.service'

export default function OrgProfile() {
  const { user } = useAuth()
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (!user) return
    getOrganizationByUserId(user.uid).then((data) => {
      setOrg(data)
      setLoading(false)
    })
  }, [user])

  function updateField(field: string, value: string) {
    if (!org) return
    setOrg({ ...org, [field]: value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!org?.id) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let logoUrl = org.logoUrl
      if (logoFile) {
        logoUrl = await uploadImage(logoFile)
      }
      await updateOrganization(org.id, { ...org, logoUrl })
      setSuccess('Perfil salvo com sucesso!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Carregando...</div>
  }

  if (!org) {
    return <div className="text-gray-500">ONG não encontrada.</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Perfil da ONG</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            required
            value={org.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            rows={3}
            value={org.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              required
              value={org.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              required
              maxLength={2}
              value={org.state}
              onChange={(e) => updateField('state', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            required
            value={org.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email de contato</label>
          <input
            type="email"
            required
            value={org.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={org.website ?? ''}
            onChange={(e) => updateField('website', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input
            type="text"
            value={org.instagram ?? ''}
            onChange={(e) => updateField('instagram', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="@usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {org.logoUrl && !logoFile && (
            <img src={org.logoUrl} alt="Logo" className="mt-2 h-16 rounded-lg object-cover" />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar perfil'}
        </button>
      </form>
    </div>
  )
}
