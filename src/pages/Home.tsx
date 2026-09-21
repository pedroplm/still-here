import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw, FaHeart, FaHouse } from 'react-icons/fa6'
import { usePageMeta } from '@/hooks/usePageMeta'
import { incrementAccessCount, getAccessCount } from '@/services/database.service'

export default function Home() {
  usePageMeta(
    'Still Here · Adoção responsável de animais',
    'Encontre animais para adoção responsável e apoie ONGs de proteção animal.',
  )
  const [accessCount, setAccessCount] = useState<number | null>(null)
  const counted = useRef(false)

  useEffect(() => {
    if (counted.current) return
    counted.current = true
    incrementAccessCount()
      .then(() => getAccessCount())
      .then(setAccessCount)
      .catch(() => {})
  }, [])

  return (
    <div className="relative">
      {accessCount !== null && (
        <div className="fixed top-20 right-4 z-40 max-w-[220px] text-right">
          <p className="bg-white/90 backdrop-blur border border-emerald-100 rounded-2xl shadow-sm px-4 py-3 text-sm text-gray-600">
            <span className="font-bold text-emerald-600">
              {accessCount.toLocaleString('pt-BR')}
            </span>{' '}
            pessoas acessaram. Isso já é um início, muito obrigado!
          </p>
        </div>
      )}
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
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaPaw />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Encontre</h3>
              <p className="text-sm text-gray-500">Navegue pelos animais disponíveis das ONGs parceiras.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaHeart />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Conecte-se</h3>
              <p className="text-sm text-gray-500">Entre em contato diretamente com a ONG responsável.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaHouse />
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
