import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getCurrentUser, logout, resendVerification } from '@/services/auth.service'

function VerifyEmailNotice({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleResend() {
    const user = getCurrentUser()
    if (!user) return
    setState('sending')
    setError('')
    try {
      await resendVerification(user)
      setState('sent')
    } catch {
      setError('Não foi possível reenviar. Tente de novo em alguns minutos.')
      setState('idle')
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l2-2h14l2 2" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirme seu e-mail</h1>
      <p className="text-gray-600 mb-4">
        Enviamos um link de confirmação para <strong>{email}</strong>. Abra o link para liberar o
        acesso à sua conta.
      </p>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {state === 'sent' && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3 mb-4">
          E-mail reenviado. Confira também a caixa de spam.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleResend}
          disabled={state === 'sending'}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {state === 'sending' ? 'Enviando...' : 'Reenviar e-mail'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-gray-600 border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Sair
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-6">
        Depois de confirmar, entre novamente com o mesmo e-mail e senha.
      </p>
    </div>
  )
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.emailVerified) {
    return <VerifyEmailNotice email={user.email ?? ''} />
  }

  return <>{children}</>
}
