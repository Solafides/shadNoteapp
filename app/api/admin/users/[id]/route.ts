import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
      }
    }
  }
})


    //  Optionally validate with zod
    const userSchema = z.array(
      z.object({
        id: z.number(),
        email: z.string().email(),
        role: z.string(),
        createdAt: z.date(),
      })
    )

    const result = userSchema.safeParse(users)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("GET /api/admin/users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (adminUser.id === params.id) {
      return NextResponse.json({ error: "You can't delete yourself" }, { status: 400 })
    }

    //  First delete user's notes
    await prisma.note.deleteMany({
      where: { userId: params.id },
    })

    //  Then delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ DELETE /api/admin/users/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


