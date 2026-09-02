import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  getAnimal,
  createAnimal,
  updateAnimal,
  type Animal,
} from '@/services/database.service'
import { uploadImage } from '@/services/storage.service'
import { useOrgId } from '@/hooks/useOrgId'

type FormData = {
  name: string
  species: Animal['species']
  breed: string
  age: string
  size: Animal['size']
  description: string
  available: boolean
}

const defaultForm: FormData = {
  name: '',
  species: 'cachorro',
  breed: '',
  age: '',
  size: 'medio',
  description: '',
  available: true,
}

export default function AnimalForm() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { orgId } = useOrgId()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<FormData>(defaultForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    getAnimal(id).then((animal) => {
      if (animal) {
        setForm({
          name: animal.name,
          species: animal.species,
          breed: animal.breed ?? '',
          age: animal.age,
          size: animal.size,
          description: animal.description,
          available: animal.available,
        })
        setExistingImageUrl(animal.imageUrl)
      }
      setInitialLoading(false)
    })
  }, [id])

  function updateField(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !orgId) return
    setError('')
    setLoading(true)

    try {
      let imageUrl = existingImageUrl
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const animalData = {
        organizationId: orgId,
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        age: form.age,
        size: form.size,
        description: form.description,
        imageUrl,
        available: form.available,
      }

      if (isEditing && id) {
        await updateAnimal(id, animalData)
      } else {
        await createAnimal(animalData)
      }
      navigate('/dashboard/animais')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar animal'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="text-gray-400">Carregando...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Editar animal' : 'Novo animal'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
            <select
              value={form.species}
              onChange={(e) => updateField('species', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
            <select
              value={form.size}
              onChange={(e) => updateField('size', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => updateField('breed', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="text"
              required
              value={form.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: 2 anos"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {existingImageUrl && !imageFile && (
            <img src={existingImageUrl} alt="Atual" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={form.available}
            onChange={(e) => updateField('available', e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="available" className="text-sm text-gray-700">
            Disponível para adoção
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/animais')}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
