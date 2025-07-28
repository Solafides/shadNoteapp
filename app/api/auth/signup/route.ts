import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'

// Step 1: Define input schema with zod
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name is required and must be at least 2 characters' }),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('📦 Incoming signup:', body)

    // Step 2: Validate using zod
    const { name, email, password } = signupSchema.parse(body)

    // Step 3: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Step 4: Hash password and create user
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created' }, { status: 201 })
  } catch (err: unknown) {
    // console.error('❌ Signup error:', err)
      
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
