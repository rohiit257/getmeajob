"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"
import { useJobs } from "@/hooks/use-jobs"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"

function PostJobContent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    companyname: "",
    country: "",
    city: "",
    salary: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { postJob } = useJobs()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await postJob(formData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to post job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-[#DE7356]" />
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Job Details</CardTitle>
              <CardDescription>Fill in the information below to post your job opening</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyname">Company Name *</Label>
                    <Input
                      id="companyname"
                      placeholder="e.g. TechCorp Inc."
                      value={formData.companyname}
                      onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
                      required
                      className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="focus:ring-[#DE7356] focus:border-[#DE7356]">
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Product Manager">Product Manager</SelectItem>
                        <SelectItem value="Designer">Designer</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="focus:ring-[#DE7356] focus:border-[#DE7356]">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      placeholder="e.g. United States"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                      className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g. San Francisco"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range *</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $80,000 - $120,000 per year"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    required
                    className="focus:ring-[#DE7356] focus:border-[#DE7356]"
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Link href="/dashboard">
                    <Button type="button" variant="outline" className="border-gray-300">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-[#DE7356] hover:bg-[#c5654a] text-white" disabled={isLoading}>
                    {isLoading ? "Posting Job..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PostJobPage() {
  return (
    <AuthGuard requireAuth={true} requiredRole="Employer">
      <PostJobContent />
    </AuthGuard>
  )
}
