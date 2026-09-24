import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getAnimals } from '@/services/database.service'
import type { Animal } from '@/types'
import { useOrgId } from '@/hooks/useOrgId'

export default function Dashboard() {
  const { user } = useAuth()
  const { orgId } = useOrgId()
  const [animalCount, setAnimalCount] = useState(0)
  const [availableCount, setAvailableCount] = useState(0)

  useEffect(() => {
    if (!user || !orgId) return
    getAnimals(orgId).then((animals: Animal[]) => {
      setAnimalCount(animals.length)
      setAvailableCount(animals.filter((a) => a.available).length)
    })
  }, [user, orgId])

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Visão geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Total de animais</p>
          <p className="text-3xl font-bold text-gray-800">{animalCount}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Disponíveis para adoção</p>
          <p className="text-3xl font-bold text-emerald-600">{availableCount}</p>
        </div>
      </div>
    </div>
  )
}