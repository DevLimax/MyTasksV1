import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskService } from '@/services/taskService'
import GlassInput from '@/components/GlassInput'
import type { Priority, Status } from '@/types/task'

interface FormErrors {
  title?: string
  general?: string
}

export default function CreateTaskPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('pending')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!title.trim()) e.title = 'O título é obrigatório.'
    else if (title.trim().length < 3) e.title = 'O título deve ter no mínimo 3 caracteres.'
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
      await taskService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
      })
      navigate('/tasks', { replace: true })
    } catch {
      setErrors({ general: 'Não foi possível criar a tarefa. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1f35 100%)' }}
    >
      <div className="w-full max-w-lg">

        {/* título */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Nova tarefa</h1>
          <p className="mt-1 text-sm text-white/40">Preencha os dados da sua nova tarefa</p>
        </div>

        {/* card */}
        <div
          className="rounded-2xl border border-white/10 p-8 shadow-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}
        >
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {errors.general && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                {errors.general}
              </div>
            )}

            <GlassInput
              label="Título"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            {/* descrição */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/40">Descrição (opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder=""
                className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none backdrop-blur-sm transition-all placeholder:text-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* prioridade */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/40">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="low" className="bg-[#1a1f35] text-white">Baixa</option>
                  <option value="medium" className="bg-[#1a1f35] text-white">Média</option>
                  <option value="high" className="bg-[#1a1f35] text-white">Alta</option>
                  <option value="veryHigh" className="bg-[#1a1f35] text-white">Muito alta</option>
                </select>
              </div>

              {/* status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/40">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                >
                  <option value="pending" className="bg-[#1a1f35] text-white">Pendente</option>
                  <option value="in_progress" className="bg-[#1a1f35] text-white">Em andamento</option>
                  <option value="delayed" className="bg-[#1a1f35] text-white">Atrasada</option>
                  <option value="completed" className="bg-[#1a1f35] text-white">Concluída</option>
                </select>
              </div>
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white/80"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #384393 0%, #717DD7 100%)' }}
              >
                {isSubmitting ? 'Criando…' : 'Criar tarefa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
