'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { highlight } from "@/lib/highlight"
import EditNoteModal from "./EditingNodeModal"

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
}

type NotesTableProps = {
  notes: Note[]
  search: string
  onEditAction: (note: Note) => void
  onDeleteAction: (id: number) => void
  page: number
  fetchNotesAction: (page: number) => void
}



export default function NotesTable({ notes, search, onEditAction, onDeleteAction, page, fetchNotesAction }: NotesTableProps) {
  if (notes.length === 0) {
    return <p className="text-gray-500 mt-6">No notes found.</p>
  }

  return (
    <Table className="mt-4 text-sm">
      <TableHeader className="bg-gray-300">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell className="whitespace-normal break-words" dangerouslySetInnerHTML={{ __html: highlight(note.title, search) }} />
            <TableCell className="whitespace-normal break-words" dangerouslySetInnerHTML={{ __html: highlight(note.content, search) }} />
            <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
            <TableCell className="flex gap-2">
              <EditNoteModal note={note} onUpdated={() => fetchNotesAction(page)} />
              <Button size="sm" variant="destructive" onClick={() => onDeleteAction(note.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
