import { useTranslation } from 'react-i18next'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Sobre() {
  const { t } = useTranslation()
  usePageMeta(t('about.meta.title'), t('about.meta.description'))
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('about.h1')}</h1>
      <div className="space-y-4 text-gray-600">
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p>{t('about.p3')}</p>
      </div>
    </div>
  )
}
