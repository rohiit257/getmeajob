"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Building,
  DollarSign,
  Users,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useJobs } from "@/hooks/use-jobs"
import { useAuth } from "@/hooks/use-auth"
import { useApplications } from "@/hooks/use-applications"
import { Navbar } from "@/components/navbar"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getJobById } = useJobs()
  const { applyToJob } = useApplications()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const [applicationError, setApplicationError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchJobDetails()
    }
  }, [params.id])

  useEffect(() => {
    if (user) {
      setApplicationData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phonenumber || "",
      }))
    }
  }, [user])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      console.log("Fetching job details for ID:", params.id)

      // Try the API call
      const response = await fetch(`http://localhost:8000/api/v1/jobs/getajob/${params.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Job details response status:", response.status)
      console.log("Job details response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Job details error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Job details full response:", data)
      console.log("Job details response structure:", JSON.stringify(data, null, 2))

      // Try different possible response structures
      let jobData = null
      if (data.job) {
        jobData = data.job
        console.log("Found job in data.job:", jobData)
      } else if (data.data) {
        jobData = data.data
        console.log("Found job in data.data:", jobData)
      } else if (data.result) {
        jobData = data.result
        console.log("Found job in data.result:", jobData)
      } else if (data._id) {
        jobData = data
        console.log("Found job as root object:", jobData)
      } else {
        console.error("No job data found in response. Available keys:", Object.keys(data))
      }

      if (jobData && jobData._id) {
        console.log("Setting job data:", jobData)
        setJob(jobData)
      } else {
        console.error("No valid job data found")
        setJob(null)
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error)
      setJob(null)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    setApplicationError("")

    try {
      console.log("Submitting application:", {
        ...applicationData,
        jobId: params.id as string,
      })

      await applyToJob({
        ...applicationData,
        jobId: params.id as string,
      })

      setApplicationSuccess(true)
      setDialogOpen(false)

      // Reset form
      setApplicationData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phonenumber || "",
        coverLetter: "",
      })

      // Show success message for 3 seconds
      setTimeout(() => {
        setApplicationSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to apply:", error)
      setApplicationError(error instanceof Error ? error.message : "Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE7356] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Job not found or may have been removed</p>
              <Link href="/jobs">
                <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Success Message */}
      {applicationSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Application submitted successfully!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/jobs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Heart className="h-4 w-4 mr-2" />
                Save Job
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-2xl text-gray-900">{job.title}</CardTitle>
                      <Badge className="bg-[#DE7356]/10 text-[#DE7356] border-0">{job.type}</Badge>
                      {job.isExpired && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-0">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-[#DE7356] font-medium text-lg">{job.companyname}</CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.city}, {job.country}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.category}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-[#DE7356]" />
                      <div>
                        <p className="font-medium text-gray-900">Company</p>
                        <p className="text-gray-600">{job.companyname}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-[#DE7356]" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">
                          {job.city}, {job.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-[#DE7356]" />
                      <div>
                        <p className="font-medium text-gray-900">Job Type</p>
                        <p className="text-gray-600">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-[#DE7356]" />
                      <div>
                        <p className="font-medium text-gray-900">Salary</p>
                        <p className="text-gray-600">{job.salary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {user && user.role === "JobSeeker" && !job.isExpired ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#DE7356] hover:bg-[#c5654a] text-white">Apply for this Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Fill out the application form below to apply for this position at {job.companyname}.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleApply} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={applicationData.name}
                            onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                            required
                            className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={applicationData.email}
                            onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                            required
                            className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={applicationData.phone}
                            onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                            required
                            className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coverLetter">Cover Letter *</Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                            required
                            rows={4}
                            className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                          />
                        </div>

                        {applicationError && (
                          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{applicationError}</div>
                        )}

                        <div className="flex space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-[#DE7356] hover:bg-[#c5654a] text-white"
                            disabled={applying}
                          >
                            {applying ? "Submitting..." : "Submit Application"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : user && user.role === "Employer" ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">You are viewing this as an employer</p>
                    <Link href="/applications">
                      <Button
                        variant="outline"
                        className="w-full border-[#DE7356] text-[#DE7356] hover:bg-[#DE7356] hover:text-white"
                      >
                        View Applications
                      </Button>
                    </Link>
                  </div>
                ) : !user ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Sign in to apply for this job</p>
                    <Link href="/auth/login">
                      <Button className="w-full bg-[#DE7356] hover:bg-[#c5654a] text-white">Sign In to Apply</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600">This job posting has expired</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-[#DE7356]" />
                    <div>
                      <p className="font-medium text-gray-900">{job.companyname}</p>
                      <p className="text-sm text-gray-600">Technology Company</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-[#DE7356]" />
                    <div>
                      <p className="font-medium text-gray-900">Company Size</p>
                      <p className="text-sm text-gray-600">50-200 employees</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
