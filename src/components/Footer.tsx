import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Still Here</h3>
            <p className="text-sm text-gray-500">
              Conectando ONGs a famílias que querem adotar de forma responsável.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Links</h3>
            <div className="flex flex-col gap-1 text-sm">
              <Link to="/animais" className="text-gray-500 hover:text-emerald-600">Animais</Link>
              <Link to="/ongs" className="text-gray-500 hover:text-emerald-600">ONGs</Link>
              <Link to="/como-adotar" className="text-gray-500 hover:text-emerald-600">Como Adotar</Link>
              <Link to="/sobre" className="text-gray-500 hover:text-emerald-600">Sobre</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Contato</h3>
            <p className="text-sm text-gray-500">contato@stillhere.org</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Still Here. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
