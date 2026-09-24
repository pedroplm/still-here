import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrganizations } from '@/services/database.service'
import type { Organization } from '@/types'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Ongs() {
  usePageMeta(
    'ONGs parceiras · Still Here',
    'Conheça as ONGs de proteção animal parceiras da Still Here.',
  )
  const [ongs, setOngs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrganizations()
      .then((data) => setOngs(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-gray-400 text-center py-20">Carregando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ONGs parceiras</h1>

      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Sua ONG também pode estar aqui</h2>
          <p className="text-emerald-50 mt-1">
            Cadastre sua ONG aqui e ajude ainda mais nossos amigos encontrarem uma nova família.
          </p>
        </div>
        <Link
          to="/registrar"
          className="shrink-0 bg-white text-emerald-600 font-semibold px-5 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Cadastrar minha ONG
        </Link>
      </div>

      {ongs.length === 0 ? (
        <p className="text-gray-500">Nenhuma ONG cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongs.map((ong) => (
            <Link
              key={ong.id}
              to={`/ongs/${ong.organizationId}`}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {ong.logoUrl ? (
                  <img
                    src={ong.logoUrl}
                    alt={ong.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                    {ong.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-800 truncate">{ong.name}</h2>
                <p className="text-sm text-gray-500">
                  {ong.city}
                  {ong.state ? `/${ong.state}` : ''}
                </p>
                {ong.instagram && (
                  <a
                    href={`https://instagram.com/${ong.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ong.instagram.startsWith('@') ? ong.instagram : `@${ong.instagram}`}
                  </a>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
