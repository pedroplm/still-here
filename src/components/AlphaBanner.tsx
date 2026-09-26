import { useTranslation } from 'react-i18next'

export default function AlphaBanner() {
  const { t } = useTranslation()

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-xs sm:text-sm text-center text-amber-900 leading-relaxed">
          <span className="font-semibold uppercase tracking-wide">{t('alpha.badge')}</span>{' '}
          {t('alpha.notice')}
        </p>
      </div>
    </div>
  )
}
