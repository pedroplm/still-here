import { useTranslation } from 'react-i18next'
import type { Organization } from '@/types'

const box = 'max-w-2xl mx-auto px-4 py-16 text-center'

export default function OrgStatusNotice({ org, loading }: { org: Organization | null; loading: boolean }) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={box}>
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className={box}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orgNotice.noOrgTitle')}</h2>
        <p className="text-gray-500">{t('orgNotice.noOrgBody')}</p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orgNotice.rejectedTitle')}</h2>
        <p className="text-gray-500 mb-4">{t('orgNotice.rejectedBody', { name: org.name })}</p>
        {org.rejectionReason && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm text-left mb-4">
            <p className="font-medium mb-1">{t('orgNotice.reasonLabel')}</p>
            <p>{org.rejectionReason}</p>
          </div>
        )}
        <p className="text-sm text-gray-500">{t('orgNotice.rejectedFooter')}</p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orgNotice.pendingTitle')}</h2>
        <p className="text-gray-600 mb-4">
          {t('orgNotice.pendingBody', { name: org.name })}
        </p>
        <p className="text-sm text-gray-500">{t('orgNotice.pendingFooter')}</p>
      </div>
    )
  }

  return null
}
