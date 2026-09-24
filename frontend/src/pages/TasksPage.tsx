import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { taskService } from '@/services/taskService'
import type { Task, Priority, Status } from '@/types/task'

// ── helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  veryHigh: 'Muito alta',
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  delayed: 'Atrasada',
  completed: 'Concluída',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  high: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  veryHigh: 'bg-red-500/20 text-red-300 border-red-400/30',
}

const STATUS_COLOR: Record<Status, string> = {
  pending: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
  in_progress: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  delayed: 'bg-red-500/20 text-red-300 border-red-400/30',
  completed: 'bg-green-500/20 text-green-300 border-green-400/30',
}

// ── component ─────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<Status | ''>('')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await taskService.list({
        userId: user.id,
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(filterPriority ? { priority: filterPriority } : {}),
      })
      setTasks(res.data.tasks)
    } catch {
      // erro silencioso — lista vazia
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [user, filterStatus, filterPriority])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      await taskService.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } finally {
      setIsDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1f35 100%)' }}>

      {/* ── header ── */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-white">myTasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">Olá, <span className="text-white/80">{user?.username}</span></span>
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/30 hover:text-white/80"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">

        {/* ── top bar ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Minhas tarefas</h2>
            <p className="mt-0.5 text-sm text-white/40">
              {isLoading ? 'Carregando…' : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <button
            onClick={() => navigate('/tasks/create')}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #384393 0%, #717DD7 100%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova tarefa
          </button>
        </div>

        {/* ── filtros ── */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* filtro status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | '')}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            >
              <option value="" className="bg-[#1a1f35] text-white">Todos</option>
              <option value="pending" className="bg-[#1a1f35] text-white">Pendente</option>
              <option value="in_progress" className="bg-[#1a1f35] text-white">Em andamento</option>
              <option value="delayed" className="bg-[#1a1f35] text-white">Atrasada</option>
              <option value="completed" className="bg-[#1a1f35] text-white">Concluída</option>
            </select>
          </div>

          {/* filtro prioridade */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40">Prioridade</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            >
              <option value="" className="bg-[#1a1f35] text-white">Todas</option>
              <option value="low" className="bg-[#1a1f35] text-white">Baixa</option>
              <option value="medium" className="bg-[#1a1f35] text-white">Média</option>
              <option value="high" className="bg-[#1a1f35] text-white">Alta</option>
              <option value="veryHigh" className="bg-[#1a1f35] text-white">Muito alta</option>
            </select>
          </div>

          {/* limpar filtros */}
          {(filterStatus || filterPriority) && (
            <div className="flex flex-col justify-end">
              <button
                onClick={() => { setFilterStatus(''); setFilterPriority('') }}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/40 transition hover:border-white/30 hover:text-white/70"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* ── lista ── */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="text-white/30 text-sm">Carregando tarefas…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 py-20 text-center"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-white/20">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/>
            </svg>
            <p className="text-white/30 text-sm">Nenhuma tarefa encontrada.</p>
            <p className="mt-1 text-white/20 text-xs">Crie sua primeira tarefa clicando em "Nova tarefa".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-xl border border-white/10 p-5 transition hover:border-white/20"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* conteúdo */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-white/50 line-clamp-2">{task.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[task.status]}`}>
                        {STATUS_LABEL[task.status]}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLOR[task.priority]}`}>
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                      {task.created_at && (
                        <span className="text-xs text-white/25 self-center">
                          {new Date(task.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ações */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => navigate(`/tasks/${task.id}/edit`)}
                      title="Editar tarefa"
                      className="rounded-lg p-2 text-white/30 transition hover:bg-white/10 hover:text-white/70"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(task.id)}
                      title="Excluir tarefa"
                      className="rounded-lg p-2 text-white/30 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── modal de confirmação de exclusão ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 p-6 shadow-2xl"
            style={{ background: 'rgba(20, 22, 35, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Excluir tarefa</h3>
                <p className="text-xs text-white/40">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-white/60">
              Tem certeza que deseja excluir esta tarefa permanentemente?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white/80 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-500/80 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
