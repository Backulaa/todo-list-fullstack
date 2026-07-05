interface DeleteConfirmModalProps {
  open: boolean
  title?: string
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  open,
  title,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
            !
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Delete this task?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              This action cannot be undone. The task{' '}
              {title ? (
                <span className="font-semibold text-slate-900">"{title}"</span>
              ) : (
                'you selected'
              )}{' '}
              will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete task'}
          </button>
        </div>
      </div>
    </div>
  )
}