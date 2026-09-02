import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './pages/dashboard/DashboardLayout'

const Home = lazy(() => import('./pages/Home'))
const Animals = lazy(() => import('./pages/Animals'))
const AnimalDetail = lazy(() => import('./pages/AnimalDetail'))
const Ongs = lazy(() => import('./pages/Ongs'))
const OngDetail = lazy(() => import('./pages/OngDetail'))
const AdocaoResponsavel = lazy(() => import('./pages/AdocaoResponsavel'))
const ComoAdotar = lazy(() => import('./pages/ComoAdotar'))
const Sobre = lazy(() => import('./pages/Sobre'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const AnimalsManager = lazy(() => import('./pages/dashboard/AnimalsManager'))
const AnimalForm = lazy(() => import('./pages/dashboard/AnimalForm'))
const OrgProfile = lazy(() => import('./pages/dashboard/OrgProfile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-400">Carregando...</div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/animais" element={<Animals />} />
          <Route path="/animais/:id" element={<AnimalDetail />} />
          <Route path="/ongs" element={<Ongs />} />
          <Route path="/ongs/:id" element={<OngDetail />} />
          <Route path="/adocao-responsavel" element={<AdocaoResponsavel />} />
          <Route path="/como-adotar" element={<ComoAdotar />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="animais" element={<AnimalsManager />} />
            <Route path="animais/novo" element={<AnimalForm />} />
            <Route path="animais/editar/:id" element={<AnimalForm />} />
            <Route path="perfil" element={<OrgProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
