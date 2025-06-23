"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, User, Settings, LogOut, Plus, FileText } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-8 w-8 text-[#DE7356]" />
          <span className="text-2xl font-bold text-gray-900">JobPortal</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/jobs" className="text-gray-600 hover:text-[#DE7356] transition-colors">
            Find Jobs
          </Link>
          {isAuthenticated && user?.role === "Employer" && (
            <Link href="/jobs/post" className="text-gray-600 hover:text-[#DE7356] transition-colors">
              Post Jobs
            </Link>
          )}
          <Link href="/companies" className="text-gray-600 hover:text-[#DE7356] transition-colors">
            Companies
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-[#DE7356] transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <>
              {user.role === "Employer" && (
                <Link href="/jobs/post">
                  <Button size="sm" className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#DE7356] text-white">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/applications" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      {user.role === "JobSeeker" ? "My Applications" : "Applications"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-600 hover:text-[#DE7356]">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
