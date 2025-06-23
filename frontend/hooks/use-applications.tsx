"use client"

import { useState } from "react"

interface Application {
  _id: string
  name: string
  email: string
  phone: string
  coverLetter: string
  jobId: string
  applicantId: string
  employerId: string
  createdAt: string
  job?: {
    _id: string
    title: string
    companyname: string
    city: string
    country: string
  }
}

interface ApplicationData {
  name: string
  email: string
  phone: string
  coverLetter: string
  jobId: string
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = "http://localhost:8000/api/v1"

  const applyToJob = async (applicationData: ApplicationData) => {
    console.log("=== APPLY TO JOB START ===")
    console.log("Application data:", applicationData)

    try {
      const response = await fetch(`${API_BASE_URL}/application/sendapplication`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(applicationData),
      })

      console.log("Apply response status:", response.status)
      console.log("Apply response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Apply error response:", errorData)
        throw new Error(`Failed to submit application: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      console.log("Apply success response:", result)
      console.log("=== APPLY TO JOB END ===")
      return result
    } catch (error) {
      console.error("Apply to job error:", error)
      throw error
    }
  }

  const getJobSeekerApplications = async () => {
    console.log("=== GET JOB SEEKER APPLICATIONS START ===")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/application/jobseeker/getall`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Job seeker applications response status:", response.status)
      console.log("Job seeker applications response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Job seeker applications error:", errorText)
        throw new Error(`Failed to fetch applications: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Job seeker applications full response:", data)
      console.log("Job seeker applications response structure:", JSON.stringify(data, null, 2))

      // Try different possible response structures
      let applicationsArray = []
      if (data.applications) {
        applicationsArray = data.applications
        console.log("Found applications in data.applications:", applicationsArray)
      } else if (data.data) {
        applicationsArray = data.data
        console.log("Found applications in data.data:", applicationsArray)
      } else if (data.result) {
        applicationsArray = data.result
        console.log("Found applications in data.result:", applicationsArray)
      } else if (Array.isArray(data)) {
        applicationsArray = data
        console.log("Found applications as root array:", applicationsArray)
      } else {
        console.error("No applications found in response. Available keys:", Object.keys(data))
      }

      console.log("Final applications array:", applicationsArray)
      console.log("Applications count:", applicationsArray.length)

      setApplications(applicationsArray)
      console.log("=== GET JOB SEEKER APPLICATIONS END ===")
    } catch (error) {
      console.error("Failed to fetch job seeker applications:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch applications")
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const getEmployerApplications = async () => {
    console.log("=== GET EMPLOYER APPLICATIONS START ===")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/application/employer/getall`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Employer applications response status:", response.status)
      console.log("Employer applications response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Employer applications error:", errorText)
        throw new Error(`Failed to fetch applications: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Employer applications full response:", data)
      console.log("Employer applications response structure:", JSON.stringify(data, null, 2))

      // Try different possible response structures
      let applicationsArray = []
      if (data.applications) {
        applicationsArray = data.applications
        console.log("Found applications in data.applications:", applicationsArray)
      } else if (data.data) {
        applicationsArray = data.data
        console.log("Found applications in data.data:", applicationsArray)
      } else if (data.result) {
        applicationsArray = data.result
        console.log("Found applications in data.result:", applicationsArray)
      } else if (Array.isArray(data)) {
        applicationsArray = data
        console.log("Found applications as root array:", applicationsArray)
      } else {
        console.error("No applications found in response. Available keys:", Object.keys(data))
      }

      console.log("Final applications array:", applicationsArray)
      console.log("Applications count:", applicationsArray.length)

      setApplications(applicationsArray)
      console.log("=== GET EMPLOYER APPLICATIONS END ===")
    } catch (error) {
      console.error("Failed to fetch employer applications:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch applications")
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const deleteApplication = async (applicationId: string) => {
    console.log("=== DELETE APPLICATION START ===")
    console.log("Deleting application:", applicationId)

    try {
      const response = await fetch(`${API_BASE_URL}/application/jobseeker/delete/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Delete application response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Delete application error:", errorData)
        throw new Error(`Failed to delete application: ${response.status} - ${errorData}`)
      }

      // Remove from local state
      setApplications((prev) => prev.filter((app) => app._id !== applicationId))

      const result = await response.json()
      console.log("Delete application success:", result)
      console.log("=== DELETE APPLICATION END ===")
      return result
    } catch (error) {
      console.error("Delete application error:", error)
      throw error
    }
  }

  // Test API endpoints
  const testApplicationsAPI = async () => {
    console.log("=== TESTING APPLICATIONS API ===")

    try {
      // Test job seeker endpoint
      console.log("Testing job seeker applications endpoint...")
      const jobSeekerResponse = await fetch(`${API_BASE_URL}/application/jobseeker/getall`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Job seeker test response:", {
        status: jobSeekerResponse.status,
        statusText: jobSeekerResponse.statusText,
        headers: Object.fromEntries(jobSeekerResponse.headers.entries()),
      })

      if (jobSeekerResponse.ok) {
        const jobSeekerData = await jobSeekerResponse.json()
        console.log("Job seeker test data:", jobSeekerData)
      } else {
        const jobSeekerError = await jobSeekerResponse.text()
        console.log("Job seeker test error:", jobSeekerError)
      }

      // Test employer endpoint
      console.log("Testing employer applications endpoint...")
      const employerResponse = await fetch(`${API_BASE_URL}/application/employer/getall`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Employer test response:", {
        status: employerResponse.status,
        statusText: employerResponse.statusText,
        headers: Object.fromEntries(employerResponse.headers.entries()),
      })

      if (employerResponse.ok) {
        const employerData = await employerResponse.json()
        console.log("Employer test data:", employerData)
      } else {
        const employerError = await employerResponse.text()
        console.log("Employer test error:", employerError)
      }
    } catch (error) {
      console.error("API test error:", error)
    }

    console.log("=== APPLICATIONS API TEST END ===")
  }

  return {
    applications,
    loading,
    error,
    applyToJob,
    getJobSeekerApplications,
    getEmployerApplications,
    deleteApplication,
    testApplicationsAPI,
  }
}
