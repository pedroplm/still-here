import { useTranslation } from 'react-i18next'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function AdocaoResponsavel() {
  const { t } = useTranslation()
  usePageMeta(t('responsible.meta.title'), t('responsible.meta.description'))
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('responsible.h1')}</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-4">{t('responsible.intro')}</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>{t('responsible.item1')}</li>
          <li>{t('responsible.item2')}</li>
          <li>{t('responsible.item3')}</li>
          <li>{t('responsible.item4')}</li>
        </ul>
        <p className="text-gray-600">{t('responsible.outro')}</p>
      </div>
    </div>
  )
}
