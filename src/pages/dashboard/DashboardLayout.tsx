import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganization } from '@/hooks/useOrganization'
import { isAdminUid } from '@/services/admin'
import OrgStatusNotice from '@/components/OrgStatusNotice'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { org, loading } = useOrganization()
  const isAdmin = isAdminUid(user?.uid)
  const blocked = loading || !org || org.status !== 'approved'
  const isCuratorWithoutOrg = isAdmin && !loading && !org

  const navItems = [
    { to: '/dashboard', label: t('dashboard.nav.overview'), end: true },
    { to: '/dashboard/animais', label: t('dashboard.nav.animals') },
    { to: '/dashboard/animais/novo', label: t('dashboard.nav.newAnimal') },
    { to: '/dashboard/perfil', label: t('dashboard.nav.profile') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('nav.dashboard')}</h1>
      {blocked ? (
        <div>
          {isCuratorWithoutOrg ? (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('curator.title')}</h2>
              <p className="text-gray-500 mb-6">{t('curator.body')}</p>
              <Link
                to="/admin/ongs"
                className="inline-block bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600"
              >
                {t('dashboard.openApprovalPanel')}
              </Link>
            </div>
          ) : (
            <>
              <OrgStatusNotice org={org} loading={loading} />
              {isAdmin && (
                <div className="text-center">
                  <Link
                    to="/admin/ongs"
                    className="inline-block bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600"
                  >
                    {t('dashboard.openApprovalPanel')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-56 shrink-0">
            <nav className="flex md:flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {isAdmin && (
                <Link
                  to="/admin/ongs"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  {t('dashboard.approveNGOs')}
                </Link>
              )}
            </nav>
          </aside>
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  )
}
