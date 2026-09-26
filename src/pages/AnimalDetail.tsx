import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { FaWhatsapp, FaGlobe } from 'react-icons/fa6'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getAnimal, getOrganization } from '@/services/database.service'
import type { Animal, Organization } from '@/types'
import { extractIdFromSlug } from '@/utils/slug'
import { sexCategories, sizeCategories, speciesCategories, ageOptions } from '@/data/categories'

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, '')
}

export default function AnimalDetail() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const id = slug ? extractIdFromSlug(slug) : undefined
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'notFound' | 'loadError' | null>(null)

  useEffect(() => {
    if (!id) return
    getAnimal(id)
      .then(async (data) => {
        if (!data) {
          setError('notFound')
          return
        }
        setAnimal(data)
        if (data.organizationId) {
          setOrg(await getOrganization(data.organizationId))
        }
      })
      .catch(() => setError('loadError'))
      .finally(() => setLoading(false))
  }, [id])

  function buildWhatsAppUrl(phone: string, animalName: string, orgName: string) {
    const digits = normalizePhone(phone)
    const message = encodeURIComponent(
      t('animalDetail.whatsappMessage', { animalName, orgName }),
    )
    return `https://wa.me/${digits}?text=${message}`
  }

  const speciesLabel = animal
    ? t(speciesCategories.find((s) => s.value === animal.species)?.labelKey ?? 'species.outro')
    : ''

  const knownAge = animal ? ageOptions.find((a) => a.value === animal.age) : undefined
  const ageLabel = knownAge ? t(knownAge.labelKey) : (animal?.age ?? '')

  usePageMeta(
    animal ? t('animalDetail.metaTitle', { name: animal.name }) : t('animalDetail.metaTitleFallback'),
    animal?.description
      ? t('animalDetail.metaDescription', {
          name: animal.name,
          species: speciesLabel,
          description: animal.description,
        })
      : undefined,
    animal?.imageUrl ?? undefined,
  )

  if (loading) {
    return <div className="text-gray-400 text-center py-20">{t('common.loading')}</div>
  }

  if (error || !animal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">
          {error === 'loadError' ? t('animalDetail.loadError') : t('animalDetail.notFound')}
        </p>
        <Link to="/animais" className="text-emerald-600 hover:underline">
          {t('animalDetail.seeAll')}
        </Link>
      </div>
    )
  }

  const isWhatsApp = Boolean(org?.phone) && !org?.website
  const contactHref = org?.website
    ? org.website
    : org?.phone
      ? buildWhatsAppUrl(org!.phone as string, animal.name, org!.name)
      : org?.email
        ? `mailto:${org.email}`
        : org?.instagram
          ? `https://instagram.com/${org.instagram.replace('@', '')}`
          : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/animais" className="text-sm text-emerald-600 hover:underline">
        ← {t('animalDetail.back')}
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
                ? t('status.available')
                : animal.status === 'adoption_pending'
                  ? t('status.adoptionPending')
                  : t('status.adopted')}
            </span>
          </div>

          {org && (
            <Link to={`/ongs/${org.organizationId}`} className="text-sm text-emerald-600 hover:underline mb-4">
              {org.name}
              {org.city ? ` · ${org.city}${org.state ? `/${org.state}` : ''}` : ''}
            </Link>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
              {speciesLabel}
            </span>
            {animal.sex && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {t(sexCategories.find((s) => s.value === animal.sex)?.labelKey ?? 'sex.indefinido')}
              </span>
            )}
            {animal.breed && (
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {animal.breed}
              </span>
            )}
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {t(sizeCategories.find((s) => s.value === animal.size)?.labelKey ?? 'size.medio')}
            </span>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {ageLabel}
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
              {org?.website ? (
                <FaGlobe className="text-xl" />
              ) : (
                isWhatsApp && <FaWhatsapp className="text-xl" />
              )}
              {org?.website
                ? t('animalDetail.interestedAdopt')
                : isWhatsApp
                  ? t('animalDetail.interestedWhatsapp')
                  : t('animalDetail.interestedAdopt')}
            </a>
          ) : (
            <div className="mt-auto text-sm text-gray-500 text-center">
              {t('animalDetail.contactOrg', { name: animal.name })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
