import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getAnimal, createAnimal, updateAnimal } from '@/services/database.service'
import type { Animal, AnimalSex, AnimalStatus } from '@/types'
import { uploadImage, validateImageFile, MAX_IMAGE_SIZE_MB } from '@/services/storage.service'
import type { ImageValidationError } from '@/services/storage.service'
import { useOrgId } from '@/hooks/useOrgId'
import { ageOptions, sexCategories, sizeCategories, speciesCategories, statusCategories } from '@/data/categories'

type FormData = {
  name: string
  species: Animal['species']
  breed: string
  sex: AnimalSex
  age: string
  size: Animal['size']
  status: AnimalStatus
  description: string
}

const defaultForm: FormData = {
  name: '',
  species: 'cachorro',
  breed: '',
  sex: 'indefinido',
  age: '',
  size: 'medio',
  status: 'available',
  description: '',
}

const fieldClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'

export default function AnimalForm() {
  const { t } = useTranslation()
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    getAnimal(id).then((animal) => {
      if (animal) {
        setForm({
          name: animal.name,
          species: animal.species,
          breed: animal.breed ?? '',
          sex: animal.sex ?? 'indefinido',
          age: animal.age,
          size: animal.size,
          status: animal.status ?? (animal.available ? 'available' : 'adopted'),
          description: animal.description,
        })
        setExistingImageUrl(animal.imageUrl)
      }
      setInitialLoading(false)
    })
  }, [id])

  function translateValidation(validation: ImageValidationError) {
    return t(validation, { size: MAX_IMAGE_SIZE_MB })
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(translateValidation(validationError))
      setImageFile(null)
      e.target.value = ''
      return
    }
    setError('')
    setImageFile(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !orgId) return
    setError('')

    if (imageFile) {
      const validation = validateImageFile(imageFile)
      if (validation) {
        setError(translateValidation(validation))
        return
      }
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      let imageUrl = existingImageUrl
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, setUploadProgress)
      }

      const animalData = {
        organizationId: orgId,
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        sex: form.sex,
        age: form.age,
        size: form.size,
        status: form.status,
        available: form.status === 'available',
        description: form.description,
        imageUrl,
      }

      if (isEditing && id) {
        await updateAnimal(id, animalData)
      } else {
        await createAnimal(animalData, user.uid)
      }
      navigate('/dashboard/animais')
    } catch {
      setError(t('animalForm.errSave'))
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (initialLoading) {
    return <div className="text-gray-400">{t('common.loading')}</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditing ? t('animalForm.editTitle') : t('animalForm.newTitle')}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.name')}</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.species')}</label>
            <select
              value={form.species}
              onChange={(e) => updateField('species', e.target.value)}
              className={fieldClass}
            >
              {speciesCategories.map((s) => (
                <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.sex')}</label>
            <select
              value={form.sex}
              onChange={(e) => updateField('sex', e.target.value)}
              className={fieldClass}
            >
              {sexCategories.map((s) => (
                <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.size')}</label>
            <select
              value={form.size}
              onChange={(e) => updateField('size', e.target.value)}
              className={fieldClass}
            >
              {sizeCategories.map((s) => (
                <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.status')}</label>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className={fieldClass}
            >
              {statusCategories.map((s) => (
                <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.breed')}</label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => updateField('breed', e.target.value)}
              className={fieldClass}
              placeholder={t('common.optional')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.age')}</label>
            <select
              required
              value={form.age}
              onChange={(e) => updateField('age', e.target.value)}
              className={fieldClass}
            >
              <option value="">{t('animalForm.agePlaceholder')}</option>
              {ageOptions.map((a) => (
                <option key={a.value} value={a.value}>{t(a.labelKey)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.description')}</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('animalForm.photo')}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <p className="text-xs text-gray-400 mt-1">
            {t('animalForm.photoHint', { size: MAX_IMAGE_SIZE_MB })}
          </p>
          {existingImageUrl && !imageFile && (
            <img src={existingImageUrl} alt={t('animalForm.currentPhotoAlt')} className="mt-2 h-24 rounded-lg object-cover" />
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t('animalForm.uploading', { progress: uploadProgress })}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/animais')}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
