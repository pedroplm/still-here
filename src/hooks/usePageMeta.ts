import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const SITE_NAME = 'Still Here'
const SITE_URL = 'https://stillhere.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`

const OG_LOCALE: Record<string, string> = {
  pt: 'pt_BR',
  en: 'en_US',
}

function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

export function usePageMeta(title: string, description?: string, image?: string) {
  const { i18n } = useTranslation()
  const locale = OG_LOCALE[i18n.resolvedLanguage ?? 'pt'] ?? OG_LOCALE.pt

  useEffect(() => {
    document.title = title
    const url = `${SITE_URL}${window.location.pathname}`
    const img = image ? absoluteUrl(image) : DEFAULT_IMAGE

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', locale)
    setMeta('property', 'og:locale:alternate', locale === OG_LOCALE.pt ? OG_LOCALE.en : OG_LOCALE.pt)
    setMeta('property', 'og:image', img)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:image', img)

    setCanonical(url)

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
  }, [title, description, image, locale])
}
