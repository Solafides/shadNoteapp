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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="flex flex-wrap gap-2">
              {user.role === 'user' ? (
                <Button size="sm" onClick={() => updateRole(user.id, 'admin')}>
                  Promote to Admin
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => updateRole(user.id, 'user')}>
                  Demote to User
                </Button>
              )}

              {/* Delete Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">Delete</Button>
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

              {/* View Notes Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="secondary">View Notes</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Notes for {user.email}</DialogTitle>
                    <DialogDescription>All submitted notes by this user</DialogDescription>
                  </DialogHeader>

                  {user.notes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notes found.</p>
                  ) : (
                    <div className="space-y-4">
                      {user.notes.map((note) => (
                        <div key={note.id} className="p-3 border rounded-md bg-muted">
                          <p className="text-sm font-semibold mb-1">Title: {note.title}</p>
                          <p className="text-xs text-muted-foreground mb-1">Subject: {note.subject}</p>
                          <p className="text-xs text-muted-foreground mb-2">Created: {new Date(note.createdAt).toLocaleString()}</p>

                          {/* Nested modal for full content */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">View Content</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl max-h-[70vh] overflow-auto">
                              <DialogHeader>
                                <DialogTitle>{note.title}</DialogTitle>
                                <DialogDescription>Subject: {note.subject}</DialogDescription>
                              </DialogHeader>
                              <div className="whitespace-pre-wrap text-sm mt-2">
                                {note.content}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
