import { useTranslation } from 'react-i18next'
import { usePageMeta } from '@/hooks/usePageMeta'

const STEPS = [
  { title: 'howToAdopt.stepOne.title', desc: 'howToAdopt.stepOne.desc' },
  { title: 'howToAdopt.stepTwo.title', desc: 'howToAdopt.stepTwo.desc' },
  { title: 'howToAdopt.stepThree.title', desc: 'howToAdopt.stepThree.desc' },
  { title: 'howToAdopt.stepFour.title', desc: 'howToAdopt.stepFour.desc' },
] as const

export default function ComoAdotar() {
  const { t } = useTranslation()
  usePageMeta(t('howToAdopt.meta.title'), t('howToAdopt.meta.description'))
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('howToAdopt.h1')}</h1>
      <div className="space-y-6">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{t(step.title)}</h3>
              <p className="text-gray-500 text-sm">{t(step.desc)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
