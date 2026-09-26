import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRandomDogImage } from '@/services/randomDog.service'

interface EmptyAnimalsProps {
  subtitle?: string
}

export default function EmptyAnimals({ subtitle }: EmptyAnimalsProps) {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    let active = true
    getRandomDogImage()
      .then((url) => {
        if (active) setImageUrl(url)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="text-center py-12 flex flex-col items-center">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={t('emptyAnimals.imageAlt')}
          className="w-56 h-56 object-cover rounded-full shadow-md mb-6"
        />
      )}
      <p className="text-gray-700 text-lg font-medium">{t('emptyAnimals.message')}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}
