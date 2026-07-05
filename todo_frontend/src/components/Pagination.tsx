import { useEffect, useState } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const [pageInput, setPageInput] = useState(String(currentPage + 1))

  useEffect(() => {
    setPageInput(String(currentPage + 1))
  }, [currentPage])

  if (totalPages <= 1) {
    return null
  }

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage >= totalPages - 1

  const handleGoToPage = () => {
    const pageNumber = Number(pageInput)

    if (!Number.isInteger(pageNumber)) {
      return
    }

    if (pageNumber < 1 || pageNumber > totalPages) {
      return
    }

    onPageChange(pageNumber - 1)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGoToPage()
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm shadow-sky-100">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div className="text-sm text-slate-500">
            Showing page{' '}
            <span className="font-semibold text-slate-900">
              {currentPage + 1}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">
              {totalPages}
            </span>
            {' '}· Total{' '}
            <span className="font-semibold text-slate-900">
              {totalElements}
            </span>{' '}
            tasks
          </div>

          <div className="text-xs text-slate-400">
            {pageSize} tasks per page
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isFirstPage}
              onClick={() => onPageChange(0)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              First
            </button>

            <button
              type="button"
              disabled={isFirstPage}
              onClick={() => onPageChange(currentPage - 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              {currentPage + 1}
            </div>

            <button
              type="button"
              disabled={isLastPage}
              onClick={() => onPageChange(currentPage + 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

            <button
              type="button"
              disabled={isLastPage}
              onClick={() => onPageChange(totalPages - 1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Last
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Go to</span>

            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 w-20 rounded-lg border border-slate-200 px-3 text-center text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <button
              type="button"
              onClick={handleGoToPage}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}