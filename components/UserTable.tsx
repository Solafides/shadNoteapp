'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type User = {
  id: string
  email: string
  role: string
  createdAt: string
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
  const confirm = window.confirm('Are you sure you want to delete this user?')
  if (!confirm) return

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
            <TableCell className="flex gap-2">
              {user.role === 'user' ? (
                <Button size="sm" onClick={() => updateRole(user.id, 'admin')}>
                  Promote to Admin
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => updateRole(user.id, 'user')}>
                  Demote to User
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}> Delete </Button>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
