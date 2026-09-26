import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { getOrganizationByUserId, updateOrganization } from '@/services/database.service'
import type { Organization } from '@/types'
import { uploadImage, validateImageFile, MAX_IMAGE_SIZE_MB } from '@/services/storage.service'
import type { ImageValidationError } from '@/services/storage.service'

const fieldClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'

const fileClass =
  'w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100'

export default function OrgProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [pixQrFile, setPixQrFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  function translateValidation(validation: ImageValidationError) {
    return t(validation, { size: MAX_IMAGE_SIZE_MB })
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void
  ) {
    const file = e.target.files?.[0] ?? null
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(translateValidation(validationError))
      setFile(null)
      e.target.value = ''
      return
    }
    setError('')
    setFile(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!org?.id) return
    setSaving(true)
    setUploading(true)
    setError('')
    setSuccess(false)
    setUploadProgress(0)

    try {
      let logoUrl = org.logoUrl
      if (logoFile) {
        const validated = validateImageFile(logoFile)
        if (validated) {
          setError(translateValidation(validated))
          return
        }
        logoUrl = await uploadImage(logoFile, setUploadProgress)
      }
      let pixQrCodeUrl = org.pixQrCodeUrl
      if (pixQrFile) {
        const validated = validateImageFile(pixQrFile)
        if (validated) {
          setError(translateValidation(validated))
          return
        }
        pixQrCodeUrl = await uploadImage(pixQrFile, setUploadProgress)
      }
      await updateOrganization(org.id, {
        name: org.name,
        description: org.description,
        city: org.city,
        state: org.state,
        phone: org.phone,
        email: org.email,
        website: org.website,
        instagram: org.instagram,
        logoUrl,
        pixKey: org.pixKey,
        pixQrCodeUrl,
      })
      setSuccess(true)
    } catch {
      setError(t('orgProfile.errSave'))
    } finally {
      setSaving(false)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  if (loading) {
    return <div className="text-gray-400">{t('common.loading')}</div>
  }

  if (!org) {
    return <div className="text-gray-500">{t('orgNotice.noOrgTitle')}</div>
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">{t('dashboard.nav.profile')}</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
          {t('orgProfile.saved')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.name')}</label>
          <input
            type="text"
            required
            value={org.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.description')}</label>
          <textarea
            rows={3}
            value={org.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.city')}</label>
            <input
              type="text"
              required
              value={org.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.state')}</label>
            <input
              type="text"
              required
              maxLength={2}
              value={org.state}
              onChange={(e) => updateField('state', e.target.value.toUpperCase())}
              className={fieldClass}
              placeholder="SP"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.phone')}</label>
          <input
            type="tel"
            required
            value={org.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={fieldClass}
          />
          <p className="text-xs text-gray-400 mt-1">{t('orgProfile.phoneHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.contactEmail')}</label>
          <input
            type="email"
            required
            value={org.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.website')}</label>
          <input
            type="url"
            value={org.website ?? ''}
            onChange={(e) => updateField('website', e.target.value)}
            className={fieldClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input
            type="text"
            value={org.instagram ?? ''}
            onChange={(e) => updateField('instagram', e.target.value)}
            className={fieldClass}
            placeholder="@usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.logo')}</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile)} className={fileClass} />
          <p className="text-xs text-gray-400 mt-1">
            {t('animalForm.photoHint', { size: MAX_IMAGE_SIZE_MB })}
          </p>
          {org.logoUrl && !logoFile && (
            <img src={org.logoUrl} alt={t('orgProfile.logoAlt')} className="mt-2 h-16 rounded-lg object-cover" />
          )}
        </div>

        <hr className="my-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('ongDetail.pix.title')}</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.pixKey')}</label>
          <input
            type="text"
            value={org.pixKey ?? ''}
            onChange={(e) => updateField('pixKey', e.target.value)}
            className={fieldClass}
            placeholder={t('orgProfile.pixKeyPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgProfile.pixQrCode')}</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPixQrFile)} className={fileClass} />
          <p className="text-xs text-gray-400 mt-1">
            {t('animalForm.photoHint', { size: MAX_IMAGE_SIZE_MB })}
          </p>
          {org.pixQrCodeUrl && !pixQrFile && (
            <img
              src={org.pixQrCodeUrl}
              alt={t('ongDetail.pix.qrAlt')}
              className="mt-2 h-32 rounded-lg object-contain bg-gray-50 p-2"
            />
          )}
        </div>

        {uploading && uploadProgress > 0 && uploadProgress < 100 && (
          <div>
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

        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
        >
          {saving ? t('common.saving') : t('orgProfile.saveProfile')}
        </button>
      </form>
    </div>
  )
}
