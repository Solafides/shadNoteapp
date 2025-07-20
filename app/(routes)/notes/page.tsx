'use client'
import  AddNoteModal  from "@/components/AddNoteModal"
import NotesTable  from "@/components/NotesTable"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  }, [status, session])

  // fallback UI
  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <AddNoteModal />
      </div>

      <NotesTable
        notes={[]}
        search=""
        onEditAction={() => {}}
        onDeleteAction={() => {}}
      />
    </div>
  )
}
