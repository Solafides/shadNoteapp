
import  AddNoteModal  from "@/components/AddNoteModal"
import NotesTable  from "@/components/NotesTable"

export default function NotesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <AddNoteModal />
      </div>

      <NotesTable
        notes={[]}
        search=""
        onEditAction={() => {}}
        onDeleteAction={() => {}}
      />
    </div>
  )
}
