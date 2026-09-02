import { useParams } from 'react-router-dom'

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalhes do animal</h1>
      <p className="text-gray-500">Animal ID: {id}</p>
      <p className="text-gray-500">Em breve, as informações completas do animal aparecerão aqui.</p>
    </div>
  )
}
