import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Página não encontrada</p>
      <Link to="/" className="text-emerald-600 hover:underline">Voltar para o início</Link>
    </div>
  )
}
