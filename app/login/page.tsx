'use client'

import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email.' }),
  password: z.string().min(6, { message: 'Minimum 6 characters required.' }),
})

type LoginFormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    }
  }, [status, session, router])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleInputChange = () => {
    if (error) {
      setError('')
    }
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError('')
    setIsLoading(true)
    
    // Clear any previous field errors
    form.clearErrors()
    
    try {
      // First, check if the email exists
      const emailCheck = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      
      const emailResult = await emailCheck.json()
      
      if (!emailResult.exists) {
        setError('No account found with this email address. Please check your email or sign up for a new account.')
        setIsLoading(false)
        return
      }
      
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        // Handle specific error types
        if (res.error === 'CredentialsSignin') {
          setError('Incorrect password. Please check your password and try again.')
        } else {
          setError(res.error)
        }
      } else {
        // The redirect will be handled by the useEffect above
        // No need to manually redirect here
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  // Don't show login form if already authenticated
  if (status === 'authenticated') {
    return <div className="flex justify-center items-center h-96">Redirecting...</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm font-medium">{error}</p>
          {error.includes('No account found') && (
            <p className="text-xs mt-1">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="underline font-medium">
                Sign up here
              </a>
            </p>
          )}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleInputChange()
                    }}
                    className={error && error.includes('email') ? 'border-red-500 focus:border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleInputChange()
                    }}
                    className={error && error.includes('password') ? 'border-red-500 focus:border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Form>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-600 underline">
          Sign up here
        </a>
      </p>
    </div>
  )
}
