'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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

export function UserTable({ users, refetch }: { users: User[]; refetch?: () => void }) {
  const updateRole = async (id: string, role: 'admin' | 'user') => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })

    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error || 'Failed to update role')
    } else {
      toast.success(`User role updated to ${role}`)
      refetch?.()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || 'Failed to delete user')
      } else {
        toast.success('User deleted successfully')
        refetch?.()
      }
    } catch {
      toast.error('Error deleting user')
      console.error('Error deleting user:', id)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
           <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
         
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
<TableCell className="w-full min-w-[300px]">
  <div className="flex flex-col gap-2">
    <div className="flex flex-col flex-wrap gap-2 w-full">
      {user.role === 'user' ? (
        <Button
         
          className="flex-1 size-min"
          onClick={() => updateRole(user.id, 'admin')}
        >
          Promote to Admin
        </Button>
      ) : (
        <Button
        
          className="flex-1 size-min"
          variant="outline"
          onClick={() => updateRole(user.id, 'user')}
        >
          Demote to User
        </Button>
      )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button  className="w-full size-min" variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The user and their data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
    </div>
  </div>
</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
