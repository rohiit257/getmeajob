"use client"

import { useState, useCallback } from "react"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  type: string
  companyname: string
  country: string
  city: string
  salary: string
  createdAt: string
  isExpired: boolean
}

export function useJobsEnhanced() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = "http://localhost:8000/api/v1"

  const handleApiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      console.log(`Making API call to: ${url}`)

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error: ${response.status} - ${errorText}`)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response data:", data)
      return data
    } catch (error) {
      console.error("API call failed:", error)
      throw error
    }
  }, [])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await handleApiCall(`${API_BASE_URL}/jobs/getalljobs`)
      setJobs(data.jobs || [])
      console.log(`Successfully fetched ${data.jobs?.length || 0} jobs`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch jobs"
      setError(errorMessage)
      console.error("fetchJobs error:", errorMessage)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [handleApiCall])

  const fetchMyJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await handleApiCall(`${API_BASE_URL}/jobs/getmyjobs`)
      setJobs(data.jobs || [])
      console.log(`Successfully fetched ${data.jobs?.length || 0} my jobs`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch my jobs"
      setError(errorMessage)
      console.error("fetchMyJobs error:", errorMessage)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [handleApiCall])

  const postJob = useCallback(
    async (jobData: Omit<Job, "_id" | "createdAt" | "isExpired">) => {
      try {
        const data = await handleApiCall(`${API_BASE_URL}/jobs/postjob`, {
          method: "POST",
          body: JSON.stringify(jobData),
        })
        console.log("Job posted successfully:", data)
        return data
      } catch (error) {
        console.error("postJob error:", error)
        throw error
      }
    },
    [handleApiCall],
  )

  const updateJob = useCallback(
    async (jobId: string, jobData: Partial<Job>) => {
      try {
        const data = await handleApiCall(`${API_BASE_URL}/jobs/update/${jobId}`, {
          method: "PUT",
          body: JSON.stringify(jobData),
        })
        console.log("Job updated successfully:", data)
        return data
      } catch (error) {
        console.error("updateJob error:", error)
        throw error
      }
    },
    [handleApiCall],
  )

  const getJobById = useCallback(
    async (jobId: string) => {
      try {
        const data = await handleApiCall(`${API_BASE_URL}/jobs/getajob/${jobId}`)
        console.log("Job fetched successfully:", data)
        return data
      } catch (error) {
        console.error("getJobById error:", error)
        throw error
      }
    },
    [handleApiCall],
  )

  const deleteJob = useCallback(
    async (jobId: string) => {
      try {
        const data = await handleApiCall(`${API_BASE_URL}/jobs/delete/${jobId}`, {
          method: "DELETE",
        })
        console.log("Job deleted successfully:", data)
        // Remove from local state
        setJobs((prev) => prev.filter((job) => job._id !== jobId))
        return data
      } catch (error) {
        console.error("deleteJob error:", error)
        throw error
      }
    },
    [handleApiCall],
  )

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    fetchMyJobs,
    postJob,
    updateJob,
    getJobById,
    deleteJob,
  }
}
