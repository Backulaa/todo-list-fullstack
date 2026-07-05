import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { todoApi } from '../api/todoApi'
import Pagination from '../components/Pagination'
import TodoEmptyState from '../components/TodoEmptyState'
import TodoFilter from '../components/TodoFilter'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import TodoLoadingState from '../components/TodoLoadingState'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import type { Todo, TodoRequest } from '../types/todo'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  const [completed, setCompleted] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const pageSize = 4

  const totalTasks = totalElements
  const completedTasks = todos.filter((todo) => todo.completed).length
  const pendingTasks = todos.filter((todo) => !todo.completed).length
  const hasFilter = debouncedKeyword.trim() !== '' || completed !== ''

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 400)

    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    setPage(0)
  }, [debouncedKeyword, completed])

  const fetchTodos = async () => {
    try {
      if (!hasLoaded) {
        setInitialLoading(true)
      } else {
        setRefreshing(true)
      }

      const completedValue = completed === '' ? undefined : completed === 'true'

      const result = await todoApi.getTodos({
        keyword: debouncedKeyword || undefined,
        completed: completedValue,
        page,
        size: pageSize,
      })

      setTodos(result.content)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load todos')
    } finally {
      setInitialLoading(false)
      setRefreshing(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [debouncedKeyword, completed, page])

  const handleSubmit = async (data: TodoRequest) => {
    try {
      if (editingTodo) {
        await todoApi.updateTodo(editingTodo.id, data)
        setEditingTodo(null)
        toast.success('Task updated successfully')
      } else {
        await todoApi.createTodo(data)
        setPage(0)
        toast.success('Task created successfully')
      }

      await fetchTodos()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save task')
    }
  }

  const handleToggleCompleted = async (todo: Todo) => {
    try {
      await todoApi.updateCompletedStatus(todo.id, !todo.completed)

      toast.success(
        todo.completed
          ? 'Task marked as pending'
          : 'Task marked as completed',
      )

      await fetchTodos()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update task status')
    }
  }

  const handleOpenDeleteModal = (todo: Todo) => {
    setTodoToDelete(todo)
  }

  const handleConfirmDelete = async () => {
    if (!todoToDelete) return

    try {
      setDeleting(true)

      await todoApi.deleteTodo(todoToDelete.id)

      if (editingTodo?.id === todoToDelete.id) {
        setEditingTodo(null)
      }

      toast.success('Task deleted successfully')
      setTodoToDelete(null)

      if (todos.length === 1 && page > 0) {
        setPage(page - 1)
      } else {
        await fetchTodos()
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <header className="relative overflow-hidden bg-gradient-to-br from-sky-300 via-cyan-200 to-emerald-200 text-slate-950">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-sky-100/50 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur">
              Todo Management Dashboard
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Manage your daily tasks beautifully
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
              Create, update, complete and organize your tasks with a clean Todo
              List application powered by React, Spring Boot and PostgreSQL.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
                Simple CRUD
              </span>

              <span className="rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
                Search & Filter
              </span>

              <span className="rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
                Dockerized App
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                ✓
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {totalTasks}
            </p>
            <p className="mt-1 text-sm text-slate-400">All matching tasks</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm shadow-emerald-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Completed on page
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                ●
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-emerald-600">
              {completedTasks}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Finished tasks on this page
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-white/90 p-5 shadow-sm shadow-cyan-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Pending on page
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                …
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-cyan-600">
              {pendingTasks}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Pending tasks on this page
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="space-y-6">
            <TodoForm
              editingTodo={editingTodo}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingTodo(null)}
            />

            <TodoFilter
              keyword={keyword}
              completed={completed}
              onKeywordChange={setKeyword}
              onCompletedChange={setCompleted}
            />
          </section>

          <section>
            <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Task List
                </h2>
                <p className="text-sm text-slate-500">
                  View and manage all your current todos.
                </p>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                {refreshing
                  ? 'Updating...'
                  : `${todos.length} of ${totalElements} task${
                      totalElements !== 1 ? 's' : ''
                    }`}
              </div>
            </div>

            {initialLoading ? (
              <TodoLoadingState />
            ) : todos.length === 0 ? (
              <TodoEmptyState hasFilter={hasFilter} />
            ) : (
              <>
                <div className="space-y-4">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggleCompleted={handleToggleCompleted}
                      onEdit={setEditingTodo}
                      onDelete={() => handleOpenDeleteModal(todo)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        </div>
      </main>
      <DeleteConfirmModal
        open={todoToDelete !== null}
        title={todoToDelete?.title}
        loading={deleting}
        onCancel={() => setTodoToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}