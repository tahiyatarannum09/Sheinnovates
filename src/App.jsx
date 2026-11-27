import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/ui/BottomNav'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import GardenPage from './pages/GardenPage'
import MarketPage from './pages/MarketPage'
import ImpactPage from './pages/ImpactPage'
import WasteTrackerPage from './pages/WasteTrackerPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider, ROLES, useAuth, getDefaultRouteForRole } from './contexts/AuthContext'
import { EcoProvider } from './contexts/EcoContext'

function RoleHomeRedirect() {
  const { user } = useAuth()
  if (user?.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />
  }
  return <HomePage />
}

function CatchAllRedirect() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={getDefaultRouteForRole(user.role)} replace />
}

function AppShell() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[#FAFAF7] max-w-md mx-auto relative pb-20 overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <RoleHomeRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <ScanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/garden"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <GardenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <MarketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <ImpactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waste-tracker"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN]}>
              <WasteTrackerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
      {isAuthenticated && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <EcoProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </EcoProvider>
    </AuthProvider>
  )
}
