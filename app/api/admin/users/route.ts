import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
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
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("GET /api/admin/users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

