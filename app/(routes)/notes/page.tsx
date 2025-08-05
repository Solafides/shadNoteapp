'use client'
import  AddNoteModal  from "@/components/AddNoteModal"
import NotesTable  from "@/components/NotesTable"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import SearchBar from '@/components/SearchBar'

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/dashboard') // ✅ redirect if admin
      }
    }

    if (status === 'unauthenticated') {
      router.push('/login') // force login
    }
  }, [status, session, router])

  // fallback UI
  if ((status as string) === 'loading') return <div className="flex justify-center items-center h-96"><Spinner size={60} color="#6366f1" /></div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <AddNoteModal />
      </div>
      <SearchBar onSearchAction={() => {}} />
      <NotesTable
        notes={[]}
        search=""
        onEditAction={async () => {}}
        onDeleteAction={async () => { return; }}
        page={1}
        fetchNotesAction={() => {}}
        loading={(status as string) === 'loading'}
      />
    </div>
  )
}
