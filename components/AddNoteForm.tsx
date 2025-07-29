"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form"

// ✅ Schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
})

type NoteFormValues = z.infer<typeof formSchema>

type AddNoteFormProps = {
  onSuccess?: () => void
  initialData?: {
    id?: number
    title: string
    subject: string
    content: string
  }
}

export function AddNoteForm({ onSuccess, initialData }: AddNoteFormProps) {
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
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create note")

      toast.success("Note added successfully")
      form.reset()
      onSuccess?.()
    } catch (_) {
      toast.error("Failed to add note")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
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

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Math, Work, Reminder..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Field */}
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

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Add Note
        </Button>
      </form>
    </Form>
  )
}
