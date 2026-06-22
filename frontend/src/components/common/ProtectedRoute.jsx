import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-chalk">
      <div className="w-7 h-7 border-2 border-[#1c1917] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    const redirectMap = { seller: '/seller/dashboard', host: '/host/dashboard', courier: '/courier/dashboard', admin: '/admin/dashboard' }
    return <Navigate to={redirectMap[user.role] || '/'} replace />
  }

  return <Outlet />
}