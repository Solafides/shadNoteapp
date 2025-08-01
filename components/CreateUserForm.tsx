'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export function CreateUserForm({ refetch }: { refetch: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name || !email || !password) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create user')
      } else {
        toast.success('User created successfully')
        refetch()
        setName('')
        setEmail('')
        setPassword('')
        setRole('user')
      }
    } catch {
      toast.error('Error creating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/50 mb-6">
      <h4 className="text-md font-semibold">Create New User</h4>
      <div className="grid gap-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'user')}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </div>
  )
}
