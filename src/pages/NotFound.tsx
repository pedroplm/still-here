import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">{t('notFound.message')}</p>
      <Link to="/" className="text-emerald-600 hover:text-underline">{t('notFound.back')}</Link>
    </div>
  )
}
