'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/dist/client/link'
import { Button } from './ui/button'
export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-black/80 text-white p-4 shadow">
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
          <Button onClick={() => signOut()} className="text-sm font-semibold  bg-white/100 hover:bg-red-400 hover:text-white  text-black">
            Log Out
          </Button>
        ) : (
          <div className="text-sm italic">Not logged in</div>
        )}
      </div>
    </header>
  )
}
