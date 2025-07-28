import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/UserTable'
import { getUserLoginsThisMonth, getNotesCreatedPerMonth, getTopNoteContributors } from '@/lib/analytics'
import { UserStats } from '@/components/UserStats'
import ClientOnly from './ClientOnly'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // 🔐 Redirect if not authenticated
  if (!session?.user?.email) {
    redirect('/login')
  }

  // 🔐 Redirect if not admin
  if (session.user.role !== 'admin') {
    redirect('/')
  }
 // 📊 Get data
  const loginsThisMonth = await getUserLoginsThisMonth()
  const notesPerMonth = await getNotesCreatedPerMonth()
  const topUsers = await getTopNoteContributors()

  // Build dummy monthly login chart (flat line for now, if only 1 value)
  const loginData = notesPerMonth.map(month => ({
    label: month.label,
    count: month.label === new Date().toLocaleString('default', { month: 'short' })
      ? loginsThisMonth
      : 0
  }))

//   const [totalUsers, totalNotes] = await Promise.all([
//   prisma.user.count(),
//   prisma.note.count(),
// ])

  // ✅ Fetch all users and convert createdAt to string
  const users = (
    await prisma.user.findMany({
      where: { role: { not: 'admin' } }, // Exclude admin users
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        notes: {
          select: {
            id: true,
            title: true,
            subject: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  ).map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    notes: user.notes.map((note) => ({
      ...note,
      id: note.id.toString(),
      createdAt: note.createdAt.toISOString(),
    })),
  }));

  // Button toggle logic (Client Component Wrapper)
  // This must be a client component to use state
  // So we wrap the dashboard in a ClientOnly component
  return (
    <ClientOnly users={users} notesPerMonth={notesPerMonth} loginData={loginData} topUsers={topUsers} />
  )
}



