import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import TasksPage from '@/pages/TasksPage'
import CreateTaskPage from '@/pages/CreateTaskPage'
import EditTaskPage from '@/pages/EditTaskPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
        <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}
