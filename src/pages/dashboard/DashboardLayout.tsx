import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganization } from '@/hooks/useOrganization'
import { isAdminUid } from '@/services/admin'
import OrgStatusNotice from '@/components/OrgStatusNotice'

const navItems = [
  { to: '/dashboard', label: 'Visão geral', end: true },
  { to: '/dashboard/animais', label: 'Animais' },
  { to: '/dashboard/animais/novo', label: 'Novo animal' },
  { to: '/dashboard/perfil', label: 'Perfil da ONG' },
]

export default function DashboardLayout() {
  const { user } = useAuth()
  const { org, loading } = useOrganization()
  const isAdmin = isAdminUid(user?.uid)
  const blocked = loading || !org || org.status !== 'approved'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {blocked ? (
        <div>
          <OrgStatusNotice org={org} loading={loading} />
          {isAdmin && (
            <div className="text-center">
              <Link
                to="/admin/ongs"
                className="inline-block bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600"
              >
                Abrir painel de aprovação
              </Link>
            </div>
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
                  Aprovar ONGs
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
