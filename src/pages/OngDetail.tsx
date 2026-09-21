import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrganization, getAnimals } from '@/services/database.service'
import type { Organization, Animal } from '@/types'
import { FaWhatsapp, FaInstagram, FaGlobe, FaPix } from 'react-icons/fa6'
import { usePageMeta } from '@/hooks/usePageMeta'
import { buildAnimalSlug } from '@/utils/slug'

export default function OngDetail() {
  const { id } = useParams<{ id: string }>()
  const [org, setOrg] = useState<Organization | null>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getOrganization(id)
      .then(async (data) => {
        if (!data) {
          setError('ONG não encontrada.')
          return
        }
        setOrg(data)
        const all = await getAnimals(data.organizationId)
        setAnimals(all.filter((a) => a.available))
      })
      .catch(() => setError('Erro ao carregar a ONG. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [id])

  usePageMeta(
    org ? `${org.name} · Still Here` : 'ONG · Still Here',
    org?.description ?? undefined,
    org?.logoUrl ?? undefined,
  )

  if (loading) {
    return <div className="text-gray-400 text-center py-20">Carregando...</div>
  }

  if (error || !org) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">{error || 'ONG não encontrada.'}</p>
        <Link to="/ongs" className="text-emerald-600 hover:underline">
          Ver todas as ONGs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/ongs" className="text-sm text-emerald-600 hover:underline">
        ← Voltar para ONGs
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {org.logoUrl ? (
          <img
            src={org.logoUrl}
            alt={org.name}
            className="w-24 h-24 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold shrink-0">
            {org.name.charAt(0)}
          </div>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{org.name}</h1>
          <p className="text-gray-500 mt-1">
            {org.city}
            {org.state ? `/${org.state}` : ''}
          </p>
          {org.instagram && (
            <a
              href={`https://instagram.com/${org.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              {org.instagram.startsWith('@') ? org.instagram : `@${org.instagram}`}
            </a>
          )}
          {org.description && (
            <p className="text-gray-600 mt-3 whitespace-pre-line">{org.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {org.phone && (
          <a
            href={`https://wa.me/${org.phone.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        )}
        {org.instagram && (
          <a
            href={`https://instagram.com/${org.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <FaInstagram /> Instagram
          </a>
        )}
        {org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <FaGlobe /> Website
          </a>
        )}
      </div>

      {(org.pixKey || org.pixQrCodeUrl) && (
        <div className="mt-8 border rounded-xl p-6 bg-gray-50">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
            <FaPix className="text-emerald-600" /> Doação via PIX
          </h2>
          {org.pixKey && (
            <div className="mb-3">
              <p className="text-sm text-gray-500">Chave PIX:</p>
              <p className="text-gray-800 font-medium bg-white border rounded-lg px-4 py-2 inline-block mt-1 select-all">
                {org.pixKey}
              </p>
            </div>
          )}
          {org.pixQrCodeUrl && (
            <img
              src={org.pixQrCodeUrl}
              alt="QR Code PIX"
              className="h-48 rounded-lg bg-white p-2 border"
            />
          )}
        </div>
      )}

      {animals.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Animais disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.filter((a): a is Animal & { id: string } => !!a.id).map((animal) => (
              <Link
                key={animal.id}
                to={`/adocao/${buildAnimalSlug(animal.species, animal.name, animal.id)}`}
                className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800">{animal.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {animal.species} · {animal.size} · {animal.age}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
