'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import  {EditNoteForm} from './EditNoteForm'

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
}

type EditNodeModalProps = {
  note: Note
  onUpdated?: () => void
}

export default function EditNodeModal({ note, onUpdated }: EditNodeModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>

        <EditNoteForm
          initialData={note}
          onSuccess={() => {
            setOpen(false)
            onUpdated?.()
          }}
        />

        {/* Cancel Button */}
        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
