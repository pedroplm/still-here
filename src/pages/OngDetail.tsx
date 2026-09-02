import { useParams } from 'react-router-dom'

export default function OngDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalhes da ONG</h1>
      <p className="text-gray-500">ONG ID: {id}</p>
      <p className="text-gray-500">Em breve, as informações completas da ONG aparecerão aqui.</p>
    </div>
  )
}
