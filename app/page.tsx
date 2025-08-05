'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AddNoteModal from '@/components/AddNoteModal'
import NotesTable from '@/components/NotesTable'
import SearchBar from '@/components/SearchBar'
import PaginationControls from '@/components/PaginationControls'
import { UseDebounced } from '@/hooks/UseDebounced'
import { useAdminRedirect } from '@/hooks/useAdminRedirect'
import { highlight } from '@/lib/highlight'
import Spinner from '@/components/ui/Spinner'

type Note = {
  id: number
  title: string
  subject: string
  content: string
  createdAt: string
}

export default function NotesPage() {
  const { status, session, isRedirecting, shouldShowContent } = useAdminRedirect()
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = UseDebounced(search, 500)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  // const [subjectFilter, setSubjectFilter] = useState('')

  const fetchNotes = useCallback(async (pageNumber: number, subject = '') => {
    try {
      const res = await fetch(
        `/api/notes?page=${pageNumber}&search=${debouncedSearch}&subject=${subject}`
      )
      const data = await res.json()
      setNotes(data.notes || [])
      setPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch {
      console.error('Failed to load notes')
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (shouldShowContent) {
      fetchNotes(page, '')
    }
  }, [debouncedSearch, page, shouldShowContent, fetchNotes])

 const handleDelete = async (id: number) => {
  const noteToDelete = notes.find((n) => n.id === id)
  if (!noteToDelete) return

  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')

  // return note content for undo
  return noteToDelete
}


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNotes(newPage)
    }
  }

  // Show loading spinner while checking authentication, redirecting admin users, or when unauthenticated
  if ((status as string) === 'loading' || isRedirecting || (status as string) === 'unauthenticated') {
    return <div className="flex justify-center items-center h-96"><Spinner size={60} color="#6366f1" /></div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Notes</h1>
        <AddNoteModal onNoteCreated={() => fetchNotes(page)} />
      </div>
      <SearchBar onSearchAction={setSearch} />
      <NotesTable
        notes={notes}
        search={search}
        onEditAction={(note) => setEditingNote(note)}
        onDeleteAction={handleDelete}
        page={page}
        fetchNotesAction={fetchNotes}
        loading={(status as string) === 'loading'}
      />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChangeAction={handlePageChange}
      />
    </div>
  )
}
