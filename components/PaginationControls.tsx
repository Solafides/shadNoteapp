'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
  currentPage: number
  totalPages: number
  onPageChangeAction: (page: number) => void
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChangeAction,
}: Props) {
  return (
    <Pagination className="mt-6">
      <PaginationContent className="flex w-full justify-between">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChangeAction(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <div className="text-sm mt-2">
          Page {currentPage} of {totalPages}
        </div>
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChangeAction(currentPage + 1)}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
