'use client'

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { UseDebounced } from "@/hooks/UseDebounced"

type Props = {
  onSearchAction: (query: string) => void
}

export default function SearchBar({ onSearchAction }: Props) {
  const [value, setValue] = useState("")
  const debouncedValue = UseDebounced(value, 400)

  useEffect(() => {
    onSearchAction(debouncedValue)
  }, [debouncedValue, onSearchAction])

  return (
    <div className="mb-4 w-full px-2 sm:px-0">
      <Input
        placeholder="Search notes..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full max-w-full sm:max-w-xl"
        autoComplete="on"
        spellCheck={false}
      />
    </div>
  )
}