"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext"; // Import authentication context
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Navbar } from "../components/Navbar";

export default function JobApplications() {
  const { isAuthorized, user, loading } = useContext(AuthContext); // Access authentication context
  const router = useRouter(); // Router for navigation

  const [applications, setApplications] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Redirect to login only after checking authentication
  useEffect(() => {
    console.log("isAuthorized:", isAuthorized, "loading:", loading);
    if (!loading && !isAuthorized) {
      console.log("User is not authorized. Redirecting to login...");
      toast.error("Please log in to view your applications");
      // router.push("/auth/login");
    }
  }, [isAuthorized, loading, router]);

  // Fetch job applications
  const fetchApplications = async () => {
    if (!isAuthorized) return; // Ensure user is authenticated
    setFetching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/application/jobseeker/getall", {
        withCredentials: true,
      });

      setApplications(response.data?.data || []); // Adjusted based on `ApiResponse`
    } catch (error) {
      toast.error("Failed to fetch applications");
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setFetching(false);
    }
  };

  // Handle delete application
  const handleDelete = async (applicationId) => {
    console.log("Deleting application with ID:", applicationId); // Debugging
  
    try {
      // Make the DELETE request to the backend
      const response = await axios.delete(
        `http://localhost:8000/api/v1/application/jobseeker/delete/${applicationId}`,
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );
  
      console.log("Delete response:", response.data); // Debugging
  
      // Update the state to remove the deleted application
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error); // Debugging
  
      // Display a user-friendly error message
      toast.error(
        error.response?.data?.message || "Failed to delete application. Please try again."
      );
    }
  };

  useEffect(() => {
    if (isAuthorized) fetchApplications();
  }, [isAuthorized]);

  // Show loading indicator while authentication check is in progress
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
     <div className="container mx-auto p-6">
      
      <h2 className="text-2xl font-bold mb-4">My Job Applications</h2>

      {fetching ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Application Id</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CoverLetter</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {applications.map((app) => (
    <TableRow key={app._id}>
      <TableCell>{app._id}</TableCell>
      <TableCell>{app.name}</TableCell>
      <TableCell>{app.email}</TableCell>
      <TableCell>
        {app.coverLetter.length > 50
          ? `${app.coverLetter.slice(0, 50)}...` // Trim to 50 characters
          : app.coverLetter} // Display full text if it's short
      </TableCell>
      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button variant="destructive" onClick={() => handleDelete(app._id)}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      )}
    </div>
    </>
   
  );
}