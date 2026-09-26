import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '@/services/auth.service'
import { createOrganization } from '@/services/database.service'
import { uploadImage } from '@/services/storage.service'
import { checkCnpj, maskCnpj } from '@/services/cnpj'
import {
  clearRegisterAttempts,
  recordRegisterAttempt,
  registerAttemptsLeft,
  registerLockRemaining,
} from '@/services/rate-limit'

function formatWait(ms: number) {
  const total = Math.ceil(ms / 1000)
  const min = Math.floor(total / 60)
  const sec = total % 60
  return `${min}min ${String(sec).padStart(2, '0')}s`
}

export default function Register() {
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    city: '',
    state: '',
    phone: '',
    cnpj: '',
    instagram: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [cnpjHint, setCnpjHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlockAt, setUnlockAt] = useState(() => Date.now() + registerLockRemaining())
  const [waitLeft, setWaitLeft] = useState(() => registerLockRemaining())
  const navigate = useNavigate()

  useEffect(() => {
    if (waitLeft <= 0) return
    const id = setInterval(() => {
      setWaitLeft(Math.max(0, unlockAt - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [waitLeft, unlockAt])

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCnpjHint('')

    const remaining = recordRegisterAttempt()
    if (remaining > 0) {
      setUnlockAt(Date.now() + remaining)
      setError('Muitas tentativas em pouco tempo.')
      return
    }

    setLoading(true)
    try {
      const check = await checkCnpj(formData.cnpj)
      if (!check.ok) {
        setError(check.reason ?? 'CNPJ inválido.')
        setLoading(false)
        return
      }
      if (check.checked && check.legalName) {
        setCnpjHint(`Receita Federal: ${check.legalName} (${check.situation ?? 'ATIVA'})`)
      }

      const user = await register(formData.email, formData.password, formData.orgName)
      let logoUrl = ''
      if (logoFile) {
        logoUrl = await uploadImage(logoFile)
      }
      await createOrganization({
        userId: user.uid,
        name: formData.orgName,
        description: '',
        city: formData.city,
        state: formData.state,
        cnpj: formData.cnpj,
        phone: formData.phone,
        email: formData.email,
        instagram: formData.instagram,
        logoUrl,
      })
      clearRegisterAttempts()
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const attemptsLeft = registerAttemptsLeft()

  if (waitLeft > 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A1.9 1.9 0 0 0 4 20.4h16a1.9 1.9 0 0 0 1.6-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Muitas tentativas</h1>
        <p className="text-gray-600 mb-4">
          Você atingiu o limite de 3 cadastros em 5 minutos.
        </p>
        <p className="text-lg font-semibold text-red-600 mb-6">{formatWait(waitLeft)}</p>
        <Link to="/" className="text-sm text-emerald-600 hover:underline">
          Voltar para a home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Cadastrar ONG</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Seu cadastro passa por curadoria antes de liberar o painel.
      </p>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}
      {cnpjHint && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{cnpjHint}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da ONG</label>
          <input
            type="text"
            required
            value={formData.orgName}
            onChange={(e) => updateField('orgName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ex: Patinhas do Bem"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <input
            type="text"
            required
            inputMode="numeric"
            value={formData.cnpj}
            onChange={(e) => updateField('cnpj', maskCnpj(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="00.000.000/0000-00"
          />
          <p className="text-xs text-gray-400 mt-1">
            Conferimos na Receita Federal se a empresa existe e está ATIVA.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="contato@ong.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) => updateField('state', e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="SP"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (WhatsApp)</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="(11) 99999-9999"
          />
          <p className="text-xs text-gray-400 mt-1">Número com WhatsApp — será usado para contato sobre adoções.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => updateField('instagram', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="@usuario"
          />
          <p className="text-xs text-gray-400 mt-1">Perfil do Instagram da ONG.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo da ONG</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <p className="text-xs text-gray-400 mt-1">Foto de perfil da ONG (aparecerá como avatar redondo).</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar para curadoria'}
        </button>
        {attemptsLeft <= 2 && (
          <p className="text-xs text-amber-600 text-center">
            Restam {attemptsLeft} tentativa{attemptsLeft === 1 ? '' : 's'} antes do bloqueio temporário.
          </p>
        )}
      </form>
      <p className="text-sm text-gray-500 text-center mt-6">
        Já tem conta?{' '}
        <Link to="/login" className="text-emerald-600 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
