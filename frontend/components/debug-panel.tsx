"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useJobs } from "@/hooks/use-jobs"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, RefreshCw } from "lucide-react"

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const { jobs, loading, fetchJobs, fetchMyJobs } = useJobs()
  const { user, isAuthenticated } = useAuth()

  const testAPI = async () => {
    try {
      console.log("=== API TEST START ===")
      const response = await fetch("http://localhost:8000/api/v1/jobs/getalljobs", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("API Test Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      const data = await response.json()
      console.log("API Test Data:", data)
      console.log("API Test Data (stringified):", JSON.stringify(data, null, 2))
      console.log("API Test - data.jobs:", data.jobs)
      console.log("API Test - data.jobs type:", typeof data.jobs)
      console.log("API Test - data.jobs length:", data.jobs?.length)

      // Check all possible properties
      console.log("All response properties:", Object.keys(data))

      console.log("=== API TEST END ===")
    } catch (error) {
      console.error("API Test Error:", error)
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsVisible(true)} size="sm" variant="outline" className="bg-white shadow-lg">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Panel</CardTitle>
            <Button onClick={() => setIsVisible(false)} size="sm" variant="ghost">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <p className="font-medium">Authentication:</p>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {user && (
              <p className="text-gray-600 mt-1">
                {user.name} ({user.role})
              </p>
            )}
          </div>

          <div>
            <p className="font-medium">Jobs:</p>
            <Badge variant={loading ? "secondary" : "default"}>
              {loading ? "Loading..." : `${jobs.length} jobs loaded`}
            </Badge>
          </div>

          <div className="space-y-2">
            <Button onClick={fetchJobs} size="sm" className="w-full text-xs" disabled={loading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Fetch All Jobs
            </Button>

            {user?.role === "Employer" && (
              <Button onClick={fetchMyJobs} size="sm" variant="outline" className="w-full text-xs" disabled={loading}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Fetch My Jobs
              </Button>
            )}

            <Button onClick={testAPI} size="sm" variant="secondary" className="w-full text-xs">
              Test API Connection
            </Button>
          </div>

          <div>
            <p className="font-medium">API Base URL:</p>
            <p className="text-gray-600 break-all">http://localhost:8000/api/v1</p>
          </div>

          {jobs.length > 0 && (
            <div>
              <p className="font-medium">Sample Job:</p>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <p>
                  <strong>Title:</strong> {jobs[0].title}
                </p>
                <p>
                  <strong>Company:</strong> {jobs[0].companyname}
                </p>
                <p>
                  <strong>Location:</strong> {jobs[0].city}, {jobs[0].country}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
