"use client"

import { useState } from "react"

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

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = "http://localhost:8000/api/v1"

  const fetchJobs = async () => {
    setLoading(true)
    try {
      console.log("Fetching all jobs...")
      const response = await fetch(`${API_BASE_URL}/jobs/getalljobs`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Jobs data received:", data)
        console.log("Full response structure:", JSON.stringify(data, null, 2))
        console.log("data.jobs:", data.jobs)
        console.log("data.jobs length:", data.jobs?.length)
        console.log("Type of data.jobs:", typeof data.jobs)

        // Try different possible response structures
        const jobsArray = data.jobs || data.data || data.result || data || []
        console.log("Extracted jobs array:", jobsArray)
        console.log("Jobs array length:", jobsArray.length)

        setJobs(jobsArray)
      } else {
        console.error("Failed to fetch jobs, status:", response.status)
        const errorData = await response.text()
        console.error("Error response:", errorData)
        setJobs([])
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMyJobs = async () => {
    setLoading(true)
    try {
      console.log("Fetching my jobs...")
      const response = await fetch(`${API_BASE_URL}/jobs/getmyjobs`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("My jobs response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("My jobs data received:", data)
        console.log("Full my jobs response structure:", JSON.stringify(data, null, 2))
        console.log("data.jobs:", data.jobs)
        console.log("data.jobs length:", data.jobs?.length)

        // Try different possible response structures
        const jobsArray = data.jobs || data.data || data.result || data || []
        console.log("Extracted my jobs array:", jobsArray)
        console.log("My jobs array length:", jobsArray.length)

        setJobs(jobsArray)
      } else {
        console.error("Failed to fetch my jobs, status:", response.status)
        const errorData = await response.text()
        console.error("Error response:", errorData)
        setJobs([])
      }
    } catch (error) {
      console.error("Failed to fetch my jobs:", error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const postJob = async (jobData: Omit<Job, "_id" | "createdAt" | "isExpired">) => {
    const response = await fetch(`${API_BASE_URL}/jobs/postjob`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      throw new Error("Failed to post job")
    }

    return response.json()
  }

  const updateJob = async (jobId: string, jobData: Partial<Job>) => {
    const response = await fetch(`${API_BASE_URL}/jobs/update/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(jobData),
    })

    if (!response.ok) {
      throw new Error("Failed to update job")
    }

    return response.json()
  }

  const getJobById = async (jobId: string) => {
    console.log("useJobs: Getting job by ID:", jobId)

    try {
      const response = await fetch(`${API_BASE_URL}/jobs/getajob/${jobId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("useJobs: getJobById response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("useJobs: getJobById error:", errorText)
        throw new Error(`Failed to fetch job: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("useJobs: getJobById response data:", data)
      return data
    } catch (error) {
      console.error("useJobs: getJobById error:", error)
      throw error
    }
  }

  return {
    jobs,
    loading,
    fetchJobs,
    fetchMyJobs,
    postJob,
    updateJob,
    getJobById,
  }
}
