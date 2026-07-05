import { useEffect, useState } from 'react'
import type { Todo, TodoRequest } from '../types/todo'

interface TodoFormProps {
  editingTodo: Todo | null
  onSubmit: (data: TodoRequest) => Promise<void>
  onCancelEdit: () => void
}

const TITLE_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 1000

export default function TodoForm({
  editingTodo,
  onSubmit,
  onCancelEdit,
}: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [titleTouched, setTitleTouched] = useState(false)

  const titleLength = title.length
  const descriptionLength = description.length

  const isTitleEmpty = titleTouched && title.trim().length === 0
  const isTitleOverLimit = titleLength > TITLE_MAX_LENGTH
  const isDescriptionOverLimit = descriptionLength > DESCRIPTION_MAX_LENGTH

  const hasError =
    title.trim().length === 0 || isTitleOverLimit || isDescriptionOverLimit

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title)
      setDescription(editingTodo.description ?? '')
    } else {
      setTitle('')
      setDescription('')
    }

    setTitleTouched(false)
  }, [editingTodo])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setTitleTouched(true)

    if (hasError) {
      return
    }

    try {
      setSubmitting(true)

      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
      })

      setTitle('')
      setDescription('')
      setTitleTouched(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100 backdrop-blur"
    >
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {editingTodo ? 'Update Task' : 'Create New Task'}
      </h2>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>

          <span
            className={`text-xs ${
              isTitleOverLimit ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {titleLength}/{TITLE_MAX_LENGTH}
          </span>
        </div>

        <input
          value={title}
          maxLength={TITLE_MAX_LENGTH + 20}
          onBlur={() => setTitleTouched(true)}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter todo title"
          className={`h-11 w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${
            isTitleEmpty || isTitleOverLimit
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
          }`}
        />

        {isTitleEmpty && (
          <p className="mt-1 text-sm text-red-500">Title is required.</p>
        )}

        {isTitleOverLimit && (
          <p className="mt-1 text-sm text-red-500">
            Title must not exceed {TITLE_MAX_LENGTH} characters.
          </p>
        )}
      </div>

      <div className="mb-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>

          <span
            className={`text-xs ${
              isDescriptionOverLimit ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>

        <textarea
          value={description}
          maxLength={DESCRIPTION_MAX_LENGTH + 50}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter todo description"
          rows={4}
          className={`w-full resize-none rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${
            isDescriptionOverLimit
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
          }`}
        />

        {isDescriptionOverLimit && (
          <p className="mt-1 text-sm text-red-500">
            Description must not exceed {DESCRIPTION_MAX_LENGTH} characters.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={submitting || hasError}
          className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : editingTodo ? 'Update Task' : 'Add Task'}
        </button>

        {editingTodo && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={submitting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}