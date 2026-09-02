import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useOrgId } from '@/hooks/useOrgId'
import { getAnimals, deleteAnimal, type Animal } from '@/services/database.service'

export default function AnimalsManager() {
  const { user } = useAuth()
  const { orgId } = useOrgId()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !orgId) return
    getAnimals(orgId).then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [user, orgId])

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return
    await deleteAnimal(id)
    setAnimals((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) {
    return <div className="text-gray-400">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Meus animais</h2>
        <Link
          to="/dashboard/animais/novo"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
        >
          + Novo animal
        </Link>
      </div>

      {animals.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">Nenhum animal cadastrado ainda.</p>
          <Link to="/dashboard/animais/novo" className="text-emerald-600 hover:underline">
            Cadastrar primeiro animal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map((animal) => (
            <div key={animal.id} className="border rounded-lg overflow-hidden bg-white">
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{animal.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      animal.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {animal.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {animal.species} · {animal.size} · {animal.age}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/animais/editar/${animal.id}`}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => animal.id && handleDelete(animal.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
