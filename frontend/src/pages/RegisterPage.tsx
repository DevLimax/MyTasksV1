import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import GlassInput from '@/components/GlassInput'

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}

    if (!username.trim()) {
      e.username = 'O nome de usuário é obrigatório.'
    } else if (username.trim().length < 3) {
      e.username = 'O nome de usuário deve ter no mínimo 3 caracteres.'
    }

    if (!email.trim()) {
      e.email = 'O e-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Informe um e-mail válido.'
    }

    if (!password) {
      e.password = 'A senha é obrigatória.'
    } else if (password.length < 6) {
      e.password = 'A senha deve ter no mínimo 6 caracteres.'
    }

    if (!confirmPassword) {
      e.confirmPassword = 'Confirme sua senha.'
    } else if (password !== confirmPassword) {
      e.confirmPassword = 'As senhas não coincidem.'
    }

    return e
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await register(username.trim(), email, password)
      navigate('/tasks', { replace: true })
    } catch {
      setErrors({ general: 'Não foi possível criar a conta. Verifique os dados e tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundImage: 'url(/bg-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay escuro leve para aumentar contraste */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">myTasks</h1>
          <p className="mt-1 text-sm text-white/70">Crie sua conta e comece a organizar suas tarefas</p>
        </div>

        {/* Card glassmorphism */}
        <div
          className="rounded-2xl border border-white/20 p-12 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Erro geral */}
            {errors.general && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                {errors.general}
              </div>
            )}

            {/* Linha 1: Nome + E-mail */}
            <div className="grid grid-cols-2 gap-4">
              <GlassInput
                label="Nome de usuário"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
              />

              <GlassInput
                label="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            {/* Linha 2: Senha + Confirmar senha */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GlassInput
                label="Senha"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <GlassInput
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #384393 0%, #717DD7 100%)' }}
            >
              {isSubmitting ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>
        {/* Link para login */}
          <p className="mt-6 text-center text-sm text-white/70">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-white hover:underline">
              Entrar
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
