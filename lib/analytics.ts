import { prisma } from './prisma'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { Prisma } from '@prisma/client'

// 1. Users logged in this month (based on sessions expiring in the current month)
export async function getUserLoginsThisMonth() {
  const start = startOfMonth(new Date())
  const end = endOfMonth(new Date())

  const count = await prisma.session.count({
    where: {
      expires: {
        gte: start,
        lte: end,
      },
    },
  })

  return count
}

// 2. Notes created each month (last 6 months)
export async function getNotesCreatedPerMonth() {
  const months: { label: string; count: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(new Date(), i))
    const end = endOfMonth(subMonths(new Date(), i))

    const count = await prisma.note.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    const label = start.toLocaleString('default', { month: 'short' })
    months.push({ label, count })
  }

  return months
}

// 3. Top users by number of notes created
export async function getTopNoteContributors(limit = 5) {
 const result = await prisma.note.groupBy({
  by: ['userId'],
  _count: {
    id: true, // Count number of notes per user
  },
  orderBy: {
    _count: {
      id: 'desc', // Sort users by how many notes they created
    },
  },
  take: limit,
})

const users = await prisma.user.findMany({
  where: {
    id: {
      in: result.map((r) => r.userId),
    },
  },
  select: {
    id: true,
    name: true,
    email: true,
  },
})

return result.map((entry) => {
  const user = users.find((u) => u.id === entry.userId)
  return {
    userId: entry.userId,
    name: user?.name || user?.email || 'Unknown',
    count: entry._count.id, // ✅ this now matches groupBy
  }
})
}
