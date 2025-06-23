"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Users, FileText, TrendingUp, MapPin, Clock, Eye, Edit, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useApplications } from "@/hooks/use-applications"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { DebugPanel } from "@/components/debug-panel"
import { useJobs } from "@/hooks/use-jobs"

function DashboardContent() {
  const { user } = useAuth()
  const { jobs, loading: jobsLoading, fetchMyJobs, fetchJobs } = useJobs()
  const { applications, getJobSeekerApplications, getEmployerApplications } = useApplications()
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
  })

  useEffect(() => {
    // Fetch dashboard data based on user role
    if (user?.role === "Employer") {
      fetchEmployerData()
    } else {
      fetchJobSeekerData()
    }
  }, [user])

  const fetchEmployerData = async () => {
    console.log("Fetching employer data...")
    await fetchMyJobs() // Fetch employer's posted jobs
    await getEmployerApplications()
  }

  const fetchJobSeekerData = async () => {
    console.log("Fetching job seeker data...")
    await getJobSeekerApplications()
  }

  useEffect(() => {
    const stats = {
      totalJobs: jobs.length,
      totalApplications: applications.length,
      activeJobs: jobs.filter((job) => !job.isExpired).length,
      pendingApplications: applications.filter((app) => {
        const daysSince = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSince < 7
      }).length,
    }

    setDashboardStats(stats)
  }, [jobs, applications])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">
                {user?.role === "Employer"
                  ? "Manage your job postings and applications"
                  : "Track your job applications"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {user?.role === "Employer" && (
                <Link href="/jobs/post">
                  <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="border-[#DE7356] text-[#DE7356] hover:bg-[#DE7356] hover:text-white">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "Employer" ? "Total Jobs Posted" : "Applications Sent"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "Employer" ? dashboardStats.totalJobs : dashboardStats.totalApplications}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#DE7356]/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#DE7356]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "Employer" ? "Active Jobs" : "Pending Applications"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "Employer" ? dashboardStats.activeJobs : dashboardStats.pendingApplications}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "Employer" ? "Total Applications Received" : "Interview Requests"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.role === "Employer" ? dashboardStats.totalApplications : "0"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role === "Employer" ? "Views This Month" : "Profile Views"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue={user?.role === "Employer" ? "jobs" : "applications"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={user?.role === "Employer" ? "jobs" : "applications"}>
              {user?.role === "Employer" ? "My Posted Jobs" : "My Applications"}
            </TabsTrigger>
            <TabsTrigger value={user?.role === "Employer" ? "applications" : "saved"}>
              {user?.role === "Employer" ? "Received Applications" : "Saved Jobs"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={user?.role === "Employer" ? "jobs" : "applications"} className="space-y-6">
            {user?.role === "Employer" ? (
              // Employer Jobs View
              <div className="space-y-4">
                {jobsLoading ? (
                  <div className="space-y-4">
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
                ) : jobs.length > 0 ? (
                  jobs.slice(0, 5).map((job) => (
                    <Card key={job._id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <Badge
                                className={
                                  job.isExpired
                                    ? "bg-red-100 text-red-800 border-0"
                                    : "bg-green-100 text-green-800 border-0"
                                }
                              >
                                {job.isExpired ? "Expired" : "Active"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.city}, {job.country}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link href={`/jobs/${job._id}`}>
                              <Button size="sm" variant="outline" className="border-gray-300">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="border-gray-300">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                      <p className="text-gray-600 mb-4">Start by posting your first job to attract candidates.</p>
                      <Link href="/jobs/post">
                        <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Job
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              // Job Seeker Applications View
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.slice(0, 4).map((application) => (
                    <Card key={application._id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.job?.title || "Job Title"}
                              </h3>
                              <Badge className="bg-yellow-100 text-yellow-800 border-0">Under Review</Badge>
                            </div>
                            <p className="text-[#DE7356] font-medium mb-2">
                              {application.job?.companyname || "Company Name"}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Applied {new Date(application.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link href="/applications">
                              <Button size="sm" variant="outline" className="border-gray-300">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here.</p>
                      <Link href="/jobs">
                        <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Browse Jobs</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value={user?.role === "Employer" ? "applications" : "saved"} className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>{user?.role === "Employer" ? "Recent Applications" : "Saved Jobs"}</CardTitle>
                <CardDescription>
                  {user?.role === "Employer"
                    ? "Review and manage applications to your job postings"
                    : "Jobs you've saved for later"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.role === "Employer" && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div key={application._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{application.name}</h4>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href="/applications">
                          <Button size="sm" variant="outline">
                            View Application
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No {user?.role === "Employer" ? "applications" : "saved jobs"} yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DebugPanel />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}
