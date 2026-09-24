import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/services/auth.service'
import logoUrl from '@/assets/logo.svg'

const NAV_LINKS = [
  { to: '/animais', label: 'Animais' },
  { to: '/ongs', label: 'ONGs' },
  { to: '/como-adotar', label: 'Como Adotar' },
  { to: '/adocao-responsavel', label: 'Adoção Responsável' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Navbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')

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
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-emerald-600">Entrar</Link>
                <Link
                  to="/registrar"
                  className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Cadastrar ONG
                </Link>
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1 text-gray-600 hover:text-emerald-600"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
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
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
