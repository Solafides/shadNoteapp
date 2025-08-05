"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
})

type NoteFormValues = z.infer<typeof formSchema>

type EditNoteFormProps = {
  onSuccess?: () => void
  initialData?: {
    id: number
    title: string
    subject: string
    content: string
  }
}

export function EditNoteForm({ onSuccess, initialData }: EditNoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      subject: initialData?.subject || "",
      content: initialData?.content || "",
    },
  })

  const onSubmit = async (data: NoteFormValues) => {
    try {
      if (!initialData?.id) {
        toast.error("Missing note ID")
        return
      }

      const res = await fetch(`/api/notes/${initialData.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update note")

      toast.success("Note updated successfully")
      form.reset()
      onSuccess?.()
    } catch {
      toast.error("Failed to update note")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Math, Reminder..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your note..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update
        </Button>
      </form>
    </Form>
  )
}
