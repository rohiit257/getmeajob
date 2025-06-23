"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: "JobSeeker" | "Employer"
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, requiredRole, redirectTo = "/auth/login" }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user && user.role !== requiredRole) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, isAuthenticated, requireAuth, requiredRole, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE7356] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
            <Link href="/auth/login">
              <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page. This page is for {requiredRole}s only.
            </p>
            <Link href="/dashboard">
              <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
