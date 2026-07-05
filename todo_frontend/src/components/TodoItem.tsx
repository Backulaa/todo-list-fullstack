import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggleCompleted: (todo: Todo) => Promise<void>
  onEdit: (todo: Todo) => void
  onDelete: () => void
}

export default function TodoItem({
  todo,
  onToggleCompleted,
  onEdit,
  onDelete,
}: TodoItemProps) {
  return (
    <article
      className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        todo.completed
          ? 'border-emerald-200 bg-emerald-50/70'
          : 'border-sky-100 bg-white'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <button
            type="button"
            onClick={() => onToggleCompleted(todo)}
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
              todo.completed
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                : 'border-amber-300 bg-amber-50 text-transparent hover:border-emerald-500 hover:bg-emerald-50'
            }`}
            aria-label="Toggle completed"
            title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            ✓
          </button>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3
                className={`break-words text-lg font-semibold leading-snug ${
                  todo.completed
                    ? 'text-emerald-800 line-through decoration-emerald-500'
                    : 'text-slate-900'
                }`}
              >
                {todo.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  todo.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </div>

            <p
              className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                todo.completed
                  ? 'bg-white/80 text-emerald-700'
                  : 'bg-sky-50 text-sky-700'
              }`}
            >
              {todo.completed
                ? 'This task has been finished.'
                : 'This task is still in progress.'}
            </p>

            {todo.description ? (
              <p
                className={`mt-2 break-words text-sm leading-6 ${
                  todo.completed ? 'text-emerald-700/80' : 'text-slate-600'
                }`}
              >
                {todo.description}
              </p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">
                No description provided.
              </p>
            )}

            <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:gap-4">
              <span>
                Created: {new Date(todo.createdAt).toLocaleString('vi-VN')}
              </span>

              <span>
                Updated: {new Date(todo.updatedAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:opacity-80 sm:transition sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}