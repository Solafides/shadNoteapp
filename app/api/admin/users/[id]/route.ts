import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import { type NextRequest } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: userId } = await params

    if (adminUser.id === userId) {
      return NextResponse.json({ error: "You can't delete yourself" }, { status: 400 })
    }

    await prisma.note.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
