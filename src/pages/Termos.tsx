import { useTranslation } from 'react-i18next'
import { usePageMeta } from '@/hooks/usePageMeta'

const SECTIONS = [
  { title: 'terms.s1.title', body: 'terms.s1.body' },
  { title: 'terms.s2.title', body: 'terms.s2.body' },
  { title: 'terms.s3.title', body: 'terms.s3.body' },
  { title: 'terms.s4.title', body: 'terms.s4.body' },
  { title: 'terms.s5.title', body: 'terms.s5.body' },
  { title: 'terms.s6.title', body: 'terms.s6.body' },
  { title: 'terms.s7.title', body: 'terms.s7.body' },
  { title: 'terms.s8.title', body: 'terms.s8.body' },
] as const

export default function Termos() {
  const { t } = useTranslation()
  usePageMeta(t('terms.meta.title'), t('terms.meta.description'))
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('terms.h1')}</h1>
      <div className="space-y-6 text-gray-600">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t(section.title)}</h2>
            <p>{t(section.body)}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
