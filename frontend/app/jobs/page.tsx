"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Briefcase, Filter, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useJobs } from "@/hooks/use-jobs"
import { Navbar } from "@/components/navbar"
import { DebugPanel } from "@/components/debug-panel"
import { useAuth } from "@/hooks/use-auth"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "")
  const [location, setLocation] = useState(searchParams?.get("location") || "")
  const [category, setCategory] = useState("All Categories")
  const [jobType, setJobType] = useState("All Types")
  const { jobs, loading, fetchJobs } = useJobs()

  useEffect(() => {
    console.log("Jobs page mounted, fetching jobs...")
    fetchJobs()
  }, [])

  useEffect(() => {
    console.log("Jobs updated:", jobs.length, "jobs loaded")
    console.log("Loading state:", loading)
  }, [jobs, loading])

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (location === "" || job.city.toLowerCase().includes(location.toLowerCase())) &&
      (category === "All Categories" || job.category === category) &&
      (jobType === "All Types" || job.type === jobType)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
              <p className="text-gray-600 mt-1">Discover opportunities that match your skills</p>
            </div>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-[#DE7356] focus:border-[#DE7356]"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 focus:ring-[#DE7356] focus:border-[#DE7356]"
                  />
                </div>
              </div>
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="focus:ring-[#DE7356] focus:border-[#DE7356]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="focus:ring-[#DE7356] focus:border-[#DE7356]">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Types">All Types</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              Showing {filteredJobs.length} jobs
              {searchTerm && ` for "${searchTerm}"`}
              {location && ` in ${location}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
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
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job._id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-[#DE7356] cursor-pointer">
                          <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <Badge className="bg-[#DE7356]/10 text-[#DE7356] border-0">{job.type}</Badge>
                        {job.isExpired && (
                          <Badge variant="destructive" className="bg-red-100 text-red-800 border-0">
                            Expired
                          </Badge>
                        )}
                      </div>

                      <p className="text-[#DE7356] font-medium mb-2">{job.companyname}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
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
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900">{job.salary}</div>
                        <div className="flex items-center space-x-2">
                          {user?.role === "JobSeeker" && (
                            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                              <Heart className="h-4 w-4" />
                            </Button>
                          )}
                          <Link href={`/jobs/${job._id}`}>
                            <Button size="sm" className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                              {user?.role === "JobSeeker" ? "Apply Now" : "View Details"}
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available positions.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setLocation("")
                setCategory("All Categories")
                setJobType("All Types")
              }}
              variant="outline"
              className="border-[#DE7356] text-[#DE7356] hover:bg-[#DE7356] hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      <DebugPanel />
    </div>
  )
}
