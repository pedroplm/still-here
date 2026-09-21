import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa6'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getAnimal, getOrganization } from '@/services/database.service'
import type { Animal, Organization } from '@/types'
import { extractIdFromSlug } from '@/utils/slug'

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, '')
}

function buildWhatsAppUrl(phone: string, animalName: string, orgName: string) {
  const digits = normalizePhone(phone)
  const message = encodeURIComponent(
    `Olá! Tenho interesse em adotar o ${animalName} da ${orgName}. Pode me passar mais informações?`,
  )
  return `https://wa.me/${digits}?text=${message}`
}

export default function AnimalDetail() {
  const { slug } = useParams<{ slug: string }>()
  const id = slug ? extractIdFromSlug(slug) : undefined
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getAnimal(id)
      .then(async (data) => {
        if (!data) {
          setError('Animal não encontrado.')
          return
        }
        setAnimal(data)
        if (data.organizationId) {
          setOrg(await getOrganization(data.organizationId))
        }
      })
      .catch(() => setError('Erro ao carregar o animal. Tente novamente.'))
      .finally(() => setLoading(false))
  }, [id])

  usePageMeta(
    animal ? `Adote ${animal.name} · Still Here` : 'Animal · Still Here',
    animal?.description
      ? `${animal.name} — ${animal.species} disponível para adoção. ${animal.description}`
      : undefined,
    animal?.imageUrl ?? undefined,
  )

  if (loading) {
    return <div className="text-gray-400 text-center py-20">Carregando...</div>
  }

  if (error || !animal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">{error || 'Animal não encontrado.'}</p>
        <Link to="/animais" className="text-emerald-600 hover:underline">
          Ver todos os animais
        </Link>
      </div>
    )
  }

  const isWhatsApp = Boolean(org?.phone)
  const contactHref = isWhatsApp
    ? buildWhatsAppUrl(org!.phone as string, animal.name, org!.name)
    : org?.email
      ? `mailto:${org.email}`
      : org?.instagram
        ? `https://instagram.com/${org.instagram.replace('@', '')}`
        : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/animais" className="text-sm text-emerald-600 hover:underline">
        ← Voltar para animais
      </Link>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="w-full h-72 md:h-full object-cover rounded-xl"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{animal.name}</h1>
            <span
              className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                animal.status === 'available' || animal.status === undefined
                  ? 'bg-green-100 text-green-700'
                  : animal.status === 'adoption_pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {animal.status === 'available' || animal.status === undefined
                ? 'Disponível'
                : animal.status === 'adoption_pending'
                  ? 'Adoção em andamento'
                  : 'Adotado'}
            </span>
          </div>

          {org && (
            <Link to={`/ongs/${org.organizationId}`} className="text-sm text-emerald-600 hover:underline mb-4">
              {org.name}
              {org.city ? ` · ${org.city}${org.state ? `/${org.state}` : ''}` : ''}
            </Link>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full capitalize">
              {animal.species}
            </span>
            {animal.sex && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
                {animal.sex}
              </span>
            )}
            {animal.breed && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {animal.breed}
              </span>
            )}
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
              {animal.size}
            </span>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {animal.age}
            </span>
          </div>

          {animal.description && (
            <p className="text-gray-600 mb-6 whitespace-pre-line">{animal.description}</p>
          )}

          {contactHref ? (
            <a
              href={contactHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto bg-emerald-600 text-white py-3 rounded-lg text-center font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              {isWhatsApp && <FaWhatsapp className="text-xl" />}
              {isWhatsApp ? 'Tenho interesse no WhatsApp' : 'Tenho interesse em adotar'}
            </a>
          ) : (
            <div className="mt-auto text-sm text-gray-500 text-center">
              Entre em contato com a ONG para adotar o {animal.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
