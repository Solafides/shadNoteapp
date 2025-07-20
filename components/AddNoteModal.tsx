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
import { AddNoteForm } from './AddNoteForm'

type AddNoteModalProps = {
  onNoteCreated?: () => void
}

export default function AddNoteModal({ onNoteCreated }: AddNoteModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        <AddNoteForm
          onSuccess={() => {
            setOpen(false)
            onNoteCreated?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
