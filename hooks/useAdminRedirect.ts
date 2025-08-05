import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAdminRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      setIsRedirecting(true)
      router.push('/admin/dashboard')
      return
    }

    setIsRedirecting(false)
  }, [status, session, router])

  return {
    status,
    session,
    isRedirecting,
    shouldShowContent: status === 'authenticated' && session?.user?.role !== 'admin'
  }
} 