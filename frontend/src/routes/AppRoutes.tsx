import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import TasksPage from '@/pages/TasksPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}
