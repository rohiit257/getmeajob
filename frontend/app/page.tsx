"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Users, Briefcase, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useJobs } from "@/hooks/use-jobs"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const { jobs, loading, fetchJobs } = useJobs()
  const { user } = useAuth()

  useEffect(() => {
    // Fetch jobs when component mounts
    fetchJobs()
  }, [])

  // Get featured jobs (first 6 jobs)
  const featuredJobs = jobs.slice(0, 6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to jobs page with search parameters
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (location) params.set("location", location)
    window.location.href = `/jobs?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Find Your Dream Job
              <span className="text-[#DE7356]"> Today</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay">
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6 mb-12 animate-slide-up">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE7356] focus:border-transparent"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE7356] focus:border-transparent"
                  />
                </div>
                <Button type="submit" className="bg-[#DE7356] hover:bg-[#c5654a] text-white px-8 py-3 rounded-lg">
                  Search Jobs
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center animate-fade-in-delay-2">
                <div className="text-3xl font-bold text-[#DE7356] mb-2">{jobs.length}+</div>
                <div className="text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center animate-fade-in-delay-3">
                <div className="text-3xl font-bold text-[#DE7356] mb-2">5,000+</div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div className="text-center animate-fade-in-delay-4">
                <div className="text-3xl font-bold text-[#DE7356] mb-2">50,000+</div>
                <div className="text-gray-600">Job Seekers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-gray-600">Discover the latest opportunities from top companies</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm animate-pulse"
                >
                  <CardHeader>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <Card key={job._id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900">{job.title}</CardTitle>
                        <CardDescription className="text-[#DE7356] font-medium">{job.companyname}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-[#DE7356]/10 text-[#DE7356] border-0">
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.city}, {job.country}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
                        <Link href={`/jobs/${job._id}`}>
                          <Button size="sm" className="bg-[#DE7356] hover:bg-[#c5654a] text-white">
                            {user?.role === "JobSeeker" ? "Apply Now" : "View Details"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
              <p className="text-gray-600 mb-4">Check back later for new opportunities.</p>
              {user?.role === "Employer" && (
                <Link href="/jobs/post">
                  <Button className="bg-[#DE7356] hover:bg-[#c5654a] text-white">Post the First Job</Button>
                </Link>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/jobs">
              <Button variant="outline" className="border-[#DE7356] text-[#DE7356] hover:bg-[#DE7356] hover:text-white">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Get started in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DE7356]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#DE7356]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and create your professional profile with your skills and experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DE7356]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-[#DE7356]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Jobs</h3>
              <p className="text-gray-600">Browse thousands of job opportunities that match your preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DE7356]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-[#DE7356]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Hired</h3>
              <p className="text-gray-600">Apply to jobs and connect with employers to land your dream position</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-[#DE7356]" />
                <span className="text-xl font-bold">JobPortal</span>
              </div>
              <p className="text-gray-400">Connecting talented professionals with amazing opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs" className="hover:text-[#DE7356] transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-[#DE7356] transition-colors">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/career-advice" className="hover:text-[#DE7356] transition-colors">
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs/post" className="hover:text-[#DE7356] transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#DE7356] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/employer-resources" className="hover:text-[#DE7356] transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-[#DE7356] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#DE7356] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#DE7356] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
