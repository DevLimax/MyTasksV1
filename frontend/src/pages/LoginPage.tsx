import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import GlassInput from '@/components/GlassInput'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!email.trim()) e.email = 'O e-mail é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Informe um e-mail válido.'
    if (!password) e.password = 'A senha é obrigatória.'
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
      await login(email, password)
      navigate('/tasks', { replace: true })
    } catch {
      setErrors({ general: 'E-mail ou senha incorretos. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/bg-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay escuro leve para aumentar contraste */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 w-full max-w-lg">

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">myTasks</h1>
          <p className="mt-1 text-sm text-white/70">Entre na sua conta para continuar</p>
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
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* Erro geral */}
            {errors.general && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                {errors.general}
              </div>
            )}

            <GlassInput
              label="E-mail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <GlassInput
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #384393 0%, #717DD7 100%)' }}
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        {/* Link para cadastro */}
          <p className="mt-6 text-center text-sm text-white/70">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-white hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
