import type { Organization } from '@/types'

const box = 'max-w-2xl mx-auto px-4 py-16 text-center'

export default function OrgStatusNotice({ org, loading }: { org: Organization | null; loading: boolean }) {
  if (loading) {
    return (
      <div className={box}>
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className={box}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhuma ONG vinculada</h2>
        <p className="text-gray-500">Esta conta ainda não tem uma ONG cadastrada.</p>
      </div>
    )
  }

  if (org.status === 'rejected') {
    return (
      <div className={box}>
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro não aprovado</h2>
        <p className="text-gray-500 mb-4">A ONG {org.name} não foi aprovada pela curadoria.</p>
        {org.rejectionReason && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm text-left mb-4">
            <p className="font-medium mb-1">Motivo</p>
            <p>{org.rejectionReason}</p>
          </div>
        )}
        <p className="text-sm text-gray-500">
          Corrija os dados e fale com a gente pelo e-mail de contato para reenviar o pedido.
        </p>
      </div>
    )
  }

  if (org.status === 'pending') {
    return (
      <div className={box}>
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro em análise</h2>
        <p className="text-gray-600 mb-4">
          Recebemos o cadastro da <strong>{org.name}</strong> e ele está sendo verificado pela nossa
          curadoria.
        </p>
        <p className="text-sm text-gray-500">
          A verificação leva até alguns dias. Assim que liberarmos, você recebe um e-mail e passa a
          conseguir cadastrar animais aqui no painel.
        </p>
      </div>
    )
  }

  return null
}
