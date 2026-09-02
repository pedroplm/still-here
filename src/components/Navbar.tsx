import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/services/auth.service'

export default function Navbar() {
  const { user } = useAuth()

  async function handleLogout() {
    await logout()
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
          </div>
        </div>
      </div>
    </nav>
  )
}
