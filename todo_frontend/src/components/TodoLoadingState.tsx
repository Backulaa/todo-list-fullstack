export default function TodoLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-slate-200" />

            <div className="flex-1">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />

              <div className="mt-4 flex gap-3">
                <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
              </div>
            </div>

            <div className="hidden shrink-0 gap-2 sm:flex">
              <div className="h-9 w-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}