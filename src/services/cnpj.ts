export interface CnpjCheck {
  ok: boolean
  checked: boolean
  reason?: string
  legalName?: string
  situation?: string
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function maskCnpj(value: string) {
  const d = onlyDigits(value).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export async function checkCnpj(raw: string): Promise<CnpjCheck> {
  const digits = onlyDigits(raw)
  if (digits.length !== 14) {
    return { ok: false, checked: true, reason: 'O CNPJ precisa ter 14 dígitos.' }
  }
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`)
    if (res.status === 404) {
      return { ok: false, checked: true, reason: 'Esse CNPJ não existe na base da Receita Federal.' }
    }
    if (!res.ok) {
      return { ok: true, checked: false }
    }
    const data = await res.json()
    const situation: string | undefined = data?.descricao_situacao_cadastral
    if (situation && situation.toUpperCase() !== 'ATIVA') {
      return {
        ok: false,
        checked: true,
        reason: `Na Receita Federal a situação desta empresa é "${situation}", não "ATIVA".`,
        situation,
      }
    }
    return {
      ok: true,
      checked: true,
      legalName: data?.razao_social ?? undefined,
      situation,
    }
  } catch {
    return { ok: true, checked: false }
  }
}
