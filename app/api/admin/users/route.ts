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
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // ✅ Optionally validate with zod
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
