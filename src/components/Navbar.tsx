import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/services/auth.service'
import { isAdminUid } from '@/services/admin'
import logoUrl from '@/assets/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { to: '/animais', label: 'nav.animals' },
  { to: '/ongs', label: 'nav.orgs' },
  { to: '/como-adotar', label: 'nav.howToAdopt' },
  { to: '/adocao-responsavel', label: 'nav.responsibleAdoption' },
  { to: '/sobre', label: 'nav.about' },
] as const

export default function Navbar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')
  const isAdmin = isAdminUid(user?.uid)

  async function handleLogout() {
    await logout()
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Still Here" className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive(link.to)
                    ? 'bg-emerald-100 text-emerald-700 rounded-lg px-3 py-2 transition-colors'
                    : 'text-gray-600 hover:text-emerald-600 rounded-lg px-3 py-2 transition-colors'
                }
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 hover:text-white"
                >
                  {t('nav.dashboard')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/ongs"
                    className={`text-sm px-4 py-2 rounded-lg ${
                      isActive('/admin')
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-amber-600 hover:text-amber-50'
                    }`}
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-emerald-600">
                  {t('nav.login')}
                </Link>
                <Link
                  to="/registrar"
                  className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  {t('nav.registerOrg')}
                </Link>
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1 text-gray-600 hover:text-emerald-600"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={
                  isActive(link.to)
                    ? 'block bg-emerald-100 text-emerald-700 rounded-lg px-3 py-2'
                    : 'block text-gray-600 hover:text-emerald-600 rounded-lg px-3 py-2'
                }
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
