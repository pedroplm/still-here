import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnimals, getOrganization } from '@/services/database.service'
import type { Animal } from '@/types'
import { usePageMeta } from '@/hooks/usePageMeta'
import { buildAnimalSlug } from '@/utils/slug'

interface AnimalCard extends Animal {
  id: string
  orgName?: string
}

const SPECIES_OPTIONS = [
  { value: 'cachorro', label: 'Cachorro' },
  { value: 'gato', label: 'Gato' },
  { value: 'ave', label: 'Ave' },
  { value: 'roedor', label: 'Roedor' },
  { value: 'outro', label: 'Outro' },
]
const SIZE_OPTIONS = [
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Médio' },
  { value: 'grande', label: 'Grande' },
]

export default function Animals() {
  usePageMeta(
    'Animais para adoção · Still Here',
    'Veja os animais disponíveis para adoção responsável nas ONGs parceiras.',
  )
  const [animals, setAnimals] = useState<AnimalCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      .catch(() => setError('Erro ao carregar os animais. Tente novamente.'))
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
    return <div className="text-gray-400 text-center py-20">Carregando...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-20">{error}</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Animais disponíveis</h1>

      {animals.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Espécie</option>
            {SPECIES_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Porte</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {(species || size) && (
            <button
              onClick={() => { setSpecies(''); setSize('') }}
              className="text-sm text-emerald-600 hover:underline px-3 py-2"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          {animals.length === 0
            ? 'Nenhum animal disponível para adoção no momento.'
            : 'Nenhum animal encontrado com esses filtros.'}
        </p>
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
                <p className="text-sm text-gray-500">{animal.species}</p>
                {animal.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{animal.description}</p>
                )}
                <div className="mt-4 pt-3 border-t mt-auto">
                  <Link
                    to={`/adocao/${buildAnimalSlug(animal.species, animal.name, animal.id)}`}
                    className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    Tenho interesse
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
