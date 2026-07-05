interface TodoEmptyStateProps {
  hasFilter: boolean
}

export default function TodoEmptyState({ hasFilter }: TodoEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
        📝
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {hasFilter ? 'No matching tasks found' : 'No tasks yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilter
          ? 'Try changing your search keyword or status filter to find the task you are looking for.'
          : 'Create your first task using the form on the left and start organizing your work.'}
      </p>
    </div>
  )
}