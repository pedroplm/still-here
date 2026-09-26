import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logoUrl from '@/assets/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logoUrl} alt="Still Here" className="h-12 w-auto mb-2" />
            <p className="text-sm text-gray-500">{t('footer.tagline')}</p>
            <LanguageSwitcher className="mt-4 sm:hidden" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">{t('footer.links')}</h3>
            <div className="flex flex-col gap-1 text-sm">
              <Link to="/animais" className="text-gray-500 hover:text-emerald-600">{t('nav.animals')}</Link>
              <Link to="/ongs" className="text-gray-500 hover:text-emerald-600">{t('nav.orgs')}</Link>
              <Link to="/como-adotar" className="text-gray-500 hover:text-emerald-600">{t('nav.howToAdopt')}</Link>
              <Link to="/sobre" className="text-gray-500 hover:text-emerald-600">{t('nav.about')}</Link>
              <Link to="/termos" className="text-gray-500 hover:text-emerald-600">{t('footer.terms')}</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">{t('footer.contact')}</h3>
            <p className="text-sm text-gray-500">contato@stillhere.org</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Still Here. {t('footer.rights')}
          </p>
          <p className="mt-1">{t('alpha.badge')}</p>
        </div>
      </div>
    </footer>
  )
}
