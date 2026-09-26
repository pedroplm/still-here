import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getAnimals, getOrganization } from '@/services/database.service'
import type { Animal } from '@/types'
import { usePageMeta } from '@/hooks/usePageMeta'
import { buildAnimalSlug } from '@/utils/slug'
import { sizeCategories, speciesCategories } from '@/data/categories'
import EmptyAnimals from '@/components/EmptyAnimals'

interface AnimalCard extends Animal {
  id: string
  orgName?: string
}

export default function Animals() {
  const { t } = useTranslation()
  usePageMeta(t('animals.meta.title'), t('animals.meta.description'))
  const [animals, setAnimals] = useState<AnimalCard[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [species, setSpecies] = useState('')
  const [size, setSize] = useState('')

  useEffect(() => {
    getAnimals()
      .then(async (list) => {
        const cards: AnimalCard[] = await Promise.all(
          list.map(async (animal) => {
            const org = animal.organizationId
              ? await getOrganization(animal.organizationId)
              : null
            return { ...animal, id: animal.id as string, orgName: org?.name }
          }),
        )
        setAnimals(cards)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return animals.filter((a) => {
      if (species && a.species !== species) return false
      if (size && a.size !== size) return false
      return true
    })
  }, [animals, species, size])

  if (loading) {
    return <div className="text-gray-400 text-center py-20">{t('common.loading')}</div>
  }

  if (failed) {
    return <div className="text-red-500 text-center py-20">{t('animals.loadError')}</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('animals.h1')}</h1>

      {animals.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">{t('animals.filterSpecies')}</option>
            {speciesCategories.map((s) => (
              <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
            ))}
          </select>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">{t('animals.filterSize')}</option>
            {sizeCategories.map((s) => (
              <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
            ))}
          </select>
          {(species || size) && (
            <button
              onClick={() => { setSpecies(''); setSize('') }}
              className="text-sm text-emerald-600 hover:underline px-3 py-2"
            >
              {t('animals.clearFilters')}
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyAnimals
          subtitle={
            animals.length === 0 ? undefined : t('animals.adjustFilters')
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.filter((a): a is AnimalCard & { id: string } => !!a.id).map((animal) => (
            <div
              key={animal.id}
              className="rounded-xl overflow-hidden shadow-sm border bg-white flex flex-col"
            >
              <Link to={`/adocao/${buildAnimalSlug(animal.species, animal.name, animal.id)}`} className="block">
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  className="w-full h-52 object-cover"
                />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-800">{animal.name}</h2>
                  {animal.orgName && (
                    <span className="text-xs text-emerald-600 font-medium truncate ml-2">
                      {animal.orgName}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {t(speciesCategories.find((s) => s.value === animal.species)?.labelKey ?? 'species.outro')}
                </p>
                {animal.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{animal.description}</p>
                )}
                <div className="mt-4 pt-3 border-t mt-auto">
                  <Link
                    to={`/adocao/${buildAnimalSlug(animal.species, animal.name, animal.id)}`}
                    className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    {t('animals.interested')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
