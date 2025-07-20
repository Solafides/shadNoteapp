'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/dist/client/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-blue-500 text-white p-4 shadow">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">📒 My Notes</Link>
        {/* <div className='flex gap-8 items-center'>
          <Link href="/" className="text-sm font-semibold">
          Home
        </Link>
        <Link href="/about" className="text-sm font-semibold">
          About
        </Link>
        <Link href="/notes" className="text-sm font-semibold">
          Search-Notes
        </Link>
        </div> */}
        {session?.user ? (
          <button onClick={() => signOut()} className="text-sm font-semibold bg-white/95 hover:bg-white/100 text-blue-500 rounded px-4 py-2">
            Log Out
          </button>
        ) : (
          <div className="text-sm italic">Not logged in</div>
        )}
      </div>
    </header>
  )
}
