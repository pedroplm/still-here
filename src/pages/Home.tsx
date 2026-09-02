import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Encontre seu novo melhor amigo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Conectamos ONGs de proteção animal a famílias que querem adotar de forma responsável.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/animais"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-medium"
            >
              Ver animais disponíveis
            </Link>
            <Link
              to="/como-adotar"
              className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 font-medium"
            >
              Como funciona a adoção
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🐾
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Encontre</h3>
              <p className="text-sm text-gray-500">Navegue pelos animais disponíveis das ONGs parceiras.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💚
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Conecte-se</h3>
              <p className="text-sm text-gray-500">Entre em contato diretamente com a ONG responsável.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🏠
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Adote</h3>
              <p className="text-sm text-gray-500">Complete o processo de adoção responsável.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
