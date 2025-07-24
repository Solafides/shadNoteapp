'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddNoteModal from '@/components/AddNoteModal'
import NotesTable from '@/components/NotesTable'
import SearchBar from '@/components/SearchBar'
import PaginationControls from '@/components/PaginationControls'
import { UseDebounced } from '@/hooks/UseDebounced'

type Note = {
  id: number
  title: string
  subject: string
  content: string
  createdAt: string
}

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = UseDebounced(search, 500)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [subjectFilter, setSubjectFilter] = useState('')

  // ✅ Protect page by role
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [status, session])

  const fetchNotes = async (pageNumber: number, subject = '') => {
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
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotes(page, subjectFilter)
    }
  }, [debouncedSearch, page, status, subjectFilter])

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchNotes(page)
      if (editingNote?.id === id) setEditingNote(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNotes(newPage)
    }
  }

  if (status === 'loading') return <p className="p-4">Loading session...</p>

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
      />

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChangeAction={handlePageChange}
      />
    </div>
  )
}
