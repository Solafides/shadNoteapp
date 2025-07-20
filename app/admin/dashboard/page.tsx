'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserTable } from '@/components/UserTable'

type User = {
  id: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

useEffect(() => {
  if (status === 'loading') return

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/')
  }
}, [status, session])


  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Unauthorized')
        router.push('/')
        return
      }

      setUsers(data)
    } catch (err) {
      toast.error('Failed to load users')
    }
  }

  if (status === 'loading') return <p className="p-6">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👑 Admin Dashboard</h1>
      <UserTable users={users} refetch={fetchUsers} />
        <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={fetchUsers}
        >
          Refresh Users
        </button>
    </div>
  )
}
