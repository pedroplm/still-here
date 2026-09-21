import { usePageMeta } from '@/hooks/usePageMeta'

export default function ComoAdotar() {
  usePageMeta(
    'Como adotar · Still Here',
    'Entenda o passo a passo para adotar um animal de forma responsável.',
  )
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Como adotar</h1>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0">1</div>
          <div>
            <h3 className="font-semibold text-gray-800">Encontre seu novo companheiro</h3>
            <p className="text-gray-500 text-sm">Navegue pelos animais disponíveis e encontre o que mais combina com você.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0">2</div>
          <div>
            <h3 className="font-semibold text-gray-800">Entre em contato com a ONG</h3>
            <p className="text-gray-500 text-sm">Clique em "Tenho interesse" e fale diretamente com a ONG responsável pelo animal.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0">3</div>
          <div>
            <h3 className="font-semibold text-gray-800">Visita e avaliação</h3>
            <p className="text-gray-500 text-sm">A ONG agendará uma visita para conhecer você e seu ambiente.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0">4</div>
          <div>
            <h3 className="font-semibold text-gray-800">Adoção finalize</h3>
            <p className="text-gray-500 text-sm">Após aprovação, complete a documentação e leve seu novo amigo para casa.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
