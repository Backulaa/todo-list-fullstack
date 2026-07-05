interface TodoFilterProps {
  keyword: string
  completed: string
  onKeywordChange: (value: string) => void
  onCompletedChange: (value: string) => void
}

const statusOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Pending',
    value: 'false',
  },
  {
    label: 'Completed',
    value: 'true',
  },
]

export default function TodoFilter({
  keyword,
  completed,
  onKeywordChange,
  onCompletedChange,
}: TodoFilterProps) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100 backdrop-blur">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">
        Filter Tasks
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map((option) => {
              const active = completed === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onCompletedChange(option.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? option.value === 'true'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : option.value === 'false'
                          ? 'bg-amber-400 text-slate-900 shadow-sm'
                          : 'bg-sky-500 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search by title or description"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </div>
    </div>
  )
}