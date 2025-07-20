'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddNoteModal from '@/components/AddNoteModal'
import NotesTable from '@/components/NotesTable'
import PaginationControls from '@/components/PaginationControls'
import SearchBar from '@/components/SearchBar'
import { UseDebounced } from '@/hooks/UseDebounced'
import { highlight } from '@/lib/highlight'

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearch = UseDebounced(search, 500)

  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  // ✅ Handle session logic
  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [status, session])

  const fetchNotes = async (pageNumber: number) => {
    const res = await fetch(`/api/notes?page=${pageNumber}&search=${debouncedSearch}`)
    const data = await res.json()
    setNotes(data.notes || [])
    setPage(data.currentPage)
    setTotalPages(data.totalPages)
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'user') {
      fetchNotes(page)
    }
  }, [page, status, session, debouncedSearch])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNotes(newPage)
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchNotes(page)
      if (editingNote?.id === id) setEditingNote(null)
    }
  }

  if (status === 'loading') return <p className="p-6">Loading session...</p>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📝 My Notes</h1>
        <AddNoteModal onNoteCreated={() => fetchNotes(page)} />
      </div>

      <div className="mb-4">
        <SearchBar onSearchAction={setSearch} />
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 mt-6">No notes found.</p>
      ) : (
        <NotesTable
          notes={notes}
          search={search}
          onEditAction={(note) => setEditingNote(note)}
          onDeleteAction={handleDelete}
          page={page}
          fetchNotesAction={fetchNotes}
        />
      )}

      {!isSearching && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChangeAction={handlePageChange}
        />
      )}
    </div>
  )
}
