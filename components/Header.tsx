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

type Note = {
  id: number
  title: string
  subject: string
  content: string
  createdAt: string
}

type User = {
  id: string
  email: string
  role: string
  createdAt: string
  notes: Note[]
}

export default function Header() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data)
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
            {/* 👇 Manage Users Dialog Trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black">
                  Manage Users
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Manage Users</DialogTitle>
                </DialogHeader>
                <UserTable users={users} refetch={fetchUsers} />
              </DialogContent>
            </Dialog>

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
