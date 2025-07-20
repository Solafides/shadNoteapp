'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import { highlight } from '@/lib/highlight'
import { UseDebounced } from '@/hooks/UseDebounced'
// import NoteForm from '@/components/NoteForm'
import NotesTable from '@/components/NotesTable'
import PaginationControls from '@/components/PaginationControls'
import AddNoteModal from '@/components/AddNoteModal'
import { Toaster } from 'sonner'



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
 

   useEffect(() => {
  if (debouncedSearch.trim() === '') {
    setIsSearching(false)
    fetchNotes(page)
    return
  }

  const fetchSearchResults = async () => {
    setIsSearching(true)
    const res = await fetch(`/api/search?q=${debouncedSearch}`)
    const data = await res.json()
    setNotes(data || [])
  }

  fetchSearchResults()
}, [debouncedSearch])

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotes(page)
    }
  }, [page, status])

  const fetchNotes = async (pageNumber: number) => {
    const res = await fetch(`/api/notes?page=${pageNumber}&search=${debouncedSearch}`)
    const data = await res.json()
    setNotes(data.notes || [])
    setPage(data.currentPage)
    setTotalPages(data.totalPages)
  }

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

  if (status === 'loading') {
  return <p className="p-4">Loading session...</p>
}

if (status === 'unauthenticated') {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to My Note App 📝</h1>
      <p className="text-gray-700 mb-4">
        Please <a href="/login" className="underline text-blue-600">log in</a> or <a href="/signup" className="underline text-blue-600">create an account</a> to view and manage your notes.
      </p>
    </div>
  )
}
  if (status === 'authenticated' && !session?.user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-700">You must be logged in to view this page.</p>
      </div>
    )
  }
  return (
    <div className="max-w-5xl mx-auto p-6">

      {status === 'authenticated' && (
        <>
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">📝 My Notes</h1>
  <AddNoteModal onNoteCreated={() => fetchNotes(page)} />
</div>
   <div className='mx-auto max-w-2xs'>

  <SearchBar onSearchAction={setSearch} />
    </div>
  {/* <NoteForm
    onCreatedAction={() => fetchNotes(page)}
    editingNote={editingNote || undefined}
    clearEdit={() => setEditingNote(null)}
  /> */}

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

  {/* Only show pagination when not searching */}
  {!isSearching && (
  <PaginationControls
    currentPage={page}
    totalPages={totalPages}
    onPageChangeAction={handlePageChange}
  />
)}

</>

      )}
    </div>
  )
}
