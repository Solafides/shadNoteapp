import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/UserTable'

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
    createdAt: note.createdAt.toISOString(),
  })),
}))


  return ( 
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4"> Admin Dashboard</h1>
      <UserTable users={users} />
    </div>
  )
}
