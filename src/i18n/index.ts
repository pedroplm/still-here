import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enJson from './en.json'
import ptJson from './pt.json'

export const LANGUAGES = ['pt', 'en'] as const

export type LanguageCode = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'stillhere:lang'

const pt = ptJson satisfies Record<string, string>
const en: Record<keyof typeof pt, string> = enJson

function isLanguage(value: string | null | undefined): value is LanguageCode {
  return LANGUAGES.some((code) => code === value)
}

function readStored(): string | null | undefined {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeLanguage(code: LanguageCode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {
    return
  }
}

function detectLanguage(): LanguageCode {
  const stored = readStored()
  if (isLanguage(stored)) return stored
  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt'
}

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  lng: detectLanguage(),
  fallbackLng: 'pt',
  supportedLngs: [...LANGUAGES],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng === 'en' ? 'en' : 'pt-BR'
})

export function getLanguage(): LanguageCode {
  return isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'pt'
}

export function setLanguage(code: LanguageCode) {
  storeLanguage(code)
  void i18n.changeLanguage(code)
}

export { i18n }
