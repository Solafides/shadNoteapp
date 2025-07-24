import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import AuthProvider from "@/components/AuthProvider"
import Header from "@/components/Header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "My Notes App",
  description: "Note-taking with Next.js, Prisma, and shadcn",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
          {/* <Footer /> */}
          <Toaster richColors position='top-center' />
          {/* <Toaster richColors /> */}
        </AuthProvider>
      </body>
    </html>
  )
}
