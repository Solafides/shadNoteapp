import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const noteSchema = z.object({
  subject: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { subject, title, content } = noteSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const note = await prisma.note.create({
      data: {
        subject,
        title,
        content,
        userId: user.id,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('POST /api/notes error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''
    const subject = searchParams.get('subject') || ''
    const pageSize = 5
    const skip = (page - 1) * pageSize

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ✅ Build filters type-safely
    const filters: Prisma.NoteWhereInput[] = []

    if (subject) {
      filters.push({
        subject: {
          contains: subject,
          mode: Prisma.QueryMode.insensitive,
        },
      })
    }

    filters.push({
      OR: [
        {
          title: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          content: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    })

    const where: Prisma.NoteWhereInput = {
      userId: user.id,
      AND: filters,
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip,
    })

    const totalCount = await prisma.note.count({ where })
    const totalPages = Math.ceil(totalCount / pageSize)

    return NextResponse.json({
      notes,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error('GET /api/notes error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
