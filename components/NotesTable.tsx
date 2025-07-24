'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

import { Button } from "@/components/ui/button"
import { highlight } from "@/lib/highlight"
import EditNoteModal from "./EditingNodeModal"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import { useMemo, useState } from "react"

type Note = {
  id: number
  title: string
  subject: string
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

function ContentModal({ content }: { content: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Note</DialogTitle>
          <DialogDescription>Full content of this note.</DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-sm max-h-[60vh] overflow-auto">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function NotesTable({
  notes,
  search,
  onEditAction,
  onDeleteAction,
  page,
  fetchNotesAction,
}: NotesTableProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const uniqueSubjects = useMemo(() => {
    const values = Array.from(new Set(notes.map((note) => note.subject)))
    return values
  }, [notes])

  const filteredNotes = useMemo(() => {
    if (selectedSubject === "all") return notes
    return notes.filter((note) => note.subject === selectedSubject)
  }, [notes, selectedSubject])

  if (notes.length === 0) {
    return <p className="text-gray-500 mt-6">No notes found.</p>
  }

  return (
    <div className="overflow-x-auto w-full space-y-4">
      {/* Dropdown Filter */}
      <div className="w-[250px] font-semibold">
        <Select onValueChange={setSelectedSubject} defaultValue="all">
          <SelectTrigger >
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="bg-gray-50 border-0 " value="all">All Subjects</SelectItem>
            {uniqueSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table className="text-sm w-full">
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNotes.map((note) => (
            <TableRow key={note.id}>
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: highlight(note.title, search),
                }}
              />
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: highlight(note.subject, search),
                }}
              />
              <TableCell className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 max-w-xs sm:max-w-sm break-words whitespace-pre-wrap">
                <span className="text-sm text-gray-800">
                  {note.content.length > 100
                    ? note.content.slice(0, 100) + "..."
                    : note.content}
                </span>
                <ContentModal content={note.content} />
              </TableCell>
              <TableCell>
                {new Date(note.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <EditNoteModal
                  note={note}
                  onUpdated={() => fetchNotesAction(page)}
                />

                <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
                  size="sm"
                  variant="destructive"
                  
                >
                  Delete
                </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDeleteAction(note.id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
