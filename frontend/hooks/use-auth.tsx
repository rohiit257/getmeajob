"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  _id: string
  name: string
  email: string
  phonenumber: string
  role: "JobSeeker" | "Employer"
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

interface LoginCredentials {
  email: string
  password: string
  role: string
}

interface RegisterData {
  name: string
  email: string
  phonenumber: string
  password: string
  role: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const API_BASE_URL = "http://localhost:8000/api/v1"

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/getuser`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
          // Store user data in localStorage as backup
          localStorage.setItem("user", JSON.stringify(data.user))
        } else {
          // Clear any stale data
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem("user")
        }
      } else {
        // If request fails, try to get user from localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            setIsAuthenticated(true)
          } catch (error) {
            localStorage.removeItem("user")
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Try to get user from localStorage as fallback
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem("user")
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear local state regardless of API call success
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
