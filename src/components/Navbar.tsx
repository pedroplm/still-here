import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/services/auth.service'

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            Still Here
          </Link>
          <div className="hidden md:flex gap-6 text-sm">
            <Link to="/animais" className="text-gray-600 hover:text-emerald-600">Animais</Link>
            <Link to="/ongs" className="text-gray-600 hover:text-emerald-600">ONGs</Link>
            <Link to="/como-adotar" className="text-gray-600 hover:text-emerald-600">Como Adotar</Link>
            <Link to="/adocao-responsavel" className="text-gray-600 hover:text-emerald-600">Adoção Responsável</Link>
            <Link to="/sobre" className="text-gray-600 hover:text-emerald-600">Sobre</Link>
          </div>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-emerald-600">Dashboard</Link>
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
            <Link to="/animais" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-emerald-600">Animais</Link>
            <Link to="/ongs" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-emerald-600">ONGs</Link>
            <Link to="/como-adotar" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-emerald-600">Como Adotar</Link>
            <Link to="/adocao-responsavel" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-emerald-600">Adoção Responsável</Link>
            <Link to="/sobre" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-emerald-600">Sobre</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
