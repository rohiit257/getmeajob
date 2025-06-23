"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Mail,
  Phone,
  FileText,
  Trash2,
  Eye,
  User,
  Building,
  Briefcase,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useApplications } from "@/hooks/use-applications"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"

function ApplicationsContent() {
  const { user } = useAuth()
  const {
    applications,
    loading,
    error,
    getJobSeekerApplications,
    getEmployerApplications,
    deleteApplication,
    testApplicationsAPI,
  } = useApplications()
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    console.log("Applications page mounted, user:", user)
    if (user?.role === "JobSeeker") {
      console.log("Fetching job seeker applications...")
      getJobSeekerApplications()
    } else if (user?.role === "Employer") {
      console.log("Fetching employer applications...")
      getEmployerApplications()
    }
  }, [user])

  useEffect(() => {
    console.log("Applications updated:", applications.length, "applications loaded")
    console.log("Applications data:", applications)
  }, [applications])

  const handleRefresh = () => {
    if (user?.role === "JobSeeker") {
      getJobSeekerApplications()
    } else if (user?.role === "Employer") {
      getEmployerApplications()
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) {
      return
    }

    setDeleting(applicationId)
    try {
      await deleteApplication(applicationId)
    } catch (error) {
      console.error("Failed to delete application:", error)
      alert("Failed to withdraw application. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (createdAt: string) => {
    const daysSinceApplied = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceApplied < 1) {
      return <Badge className="bg-blue-100 text-blue-800 border-0">New</Badge>
    } else if (daysSinceApplied < 7) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-0">Under Review</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800 border-0">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.role === "JobSeeker" ? "My Applications" : "Job Applications"}
                </h1>
                <p className="text-gray-600">
                  {user?.role === "JobSeeker"
                    ? "Track your job applications and their status"
                    : "Review applications for your job postings"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleRefresh} size="sm" variant="outline" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={testApplicationsAPI} size="sm" variant="secondary">
                Test API
              </Button>
              <div className="text-sm text-gray-500">
                {applications.length} {applications.length === 1 ? "application" : "applications"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Error loading applications</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === "JobSeeker"
                ? "Start applying to jobs to see your applications here."
                : "Applications for your job postings will appear here."}
            </p>
            <div className="space-x-2">
              <Link href={user?.role === "JobSeeker" ? "/jobs" : "/jobs/post"}>
                <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                  {user?.role === "JobSeeker" ? "Browse Jobs" : "Post a Job"}
                </Button>
              </Link>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application._id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.role === "JobSeeker" ? application.job?.title || "Job Title" : application.name}
                        </h3>
                        {getStatusBadge(application.createdAt)}
                      </div>

                      {user?.role === "JobSeeker" ? (
                        <div>
                          <p className="text-[#DE7356] font-medium mb-2">
                            {application.job?.companyname || "Company Name"}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.job?.city || "Location"}, {application.job?.country || "Country"}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{application.coverLetter}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {application.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {application.phone}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{application.coverLetter}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {user?.role === "JobSeeker" ? "Application Details" : "Applicant Details"}
                            </DialogTitle>
                            <DialogDescription>
                              {user?.role === "JobSeeker" ? "Your application information" : "Review this application"}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-6">
                              {user?.role === "Employer" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Applicant Name</Label>
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">{selectedApplication.name}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">{selectedApplication.email}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">{selectedApplication.phone}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Applied Date</Label>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">
                                        {new Date(selectedApplication.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {user?.role === "JobSeeker" && selectedApplication.job && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Job Title</Label>
                                    <div className="flex items-center space-x-2">
                                      <Briefcase className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">{selectedApplication.job.title}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Company</Label>
                                    <div className="flex items-center space-x-2">
                                      <Building className="h-4 w-4 text-[#DE7356]" />
                                      <span className="text-gray-900">{selectedApplication.job.companyname}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Cover Letter</Label>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {user?.role === "JobSeeker" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteApplication(application._id)}
                          disabled={deleting === application._id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deleting === application._id ? "Withdrawing..." : "Withdraw"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ApplicationsContent />
    </AuthGuard>
  )
}
