import { useTranslation } from 'react-i18next'
import { getLanguage, LANGUAGES, setLanguage } from '@/i18n'
import type { LanguageCode } from '@/i18n'

const LABELS: Record<LanguageCode, 'language.pt' | 'language.en'> = {
  pt: 'language.pt',
  en: 'language.en',
}

type Props = {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: Props) {
  const { t } = useTranslation()
  const current = getLanguage()

  return (
    <div
      role="group"
      aria-label={t('nav.languageSwitcher')}
      className={`inline-flex items-center rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {LANGUAGES.map((code) => {
        const active = code === current
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            aria-label={t(LABELS[code])}
            className={
              active
                ? 'px-2 py-1.5 text-xs font-semibold bg-emerald-600 text-white'
                : 'px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-emerald-700'
            }
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
