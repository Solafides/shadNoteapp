'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserTable } from './UserTable'
import { CreateUserForm } from './CreateUserForm'


type Note = {
  id: number
  title: string
  subject: string
  content: string
  createdAt: string
}

type User = {
  id: string
  name?: string
  email: string
  role: string
  createdAt: string
  notes: Note[]
}

export default function Header() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [nameFilter, setNameFilter] = useState('')

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (session?.user) {
      fetchUsers()
    }
  }, [session])

  return (
    <header className="bg-black/80 text-white p-4 shadow">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">
          📒 My Notes
        </Link>

        {session?.user ? (
  <div className="flex gap-4 items-center">
    {/* 👇 Only show Manage Users for admin */}
    {session.user.role === 'admin' && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black">
            Manage Users
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[95vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Manage Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Filter by name"
                onChange={(e) => setNameFilter(e.target.value)}
                className="p-2 border rounded w-full sm:w-[300px] text-black"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full sm:w-auto">
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                  </DialogHeader>
                  <CreateUserForm refetch={fetchUsers} />
                </DialogContent>
              </Dialog>
            </div>
            <UserTable
              users={users.filter(user =>
                user.name?.toLowerCase().includes(nameFilter.toLowerCase())
              )}
              refetch={fetchUsers}
            />
          </div>
        </DialogContent>
      </Dialog>
    )}
    <Button
      onClick={() => signOut()}
      className="text-sm font-semibold bg-white text-black hover:bg-red-400 hover:text-white"
    >
      Log Out
    </Button>
  </div>
) : (
  <div className="text-sm italic">Not logged in</div>
)}
      </div>
    </header>
  )
}
