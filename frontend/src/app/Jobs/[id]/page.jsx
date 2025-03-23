"use client";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const JobProfile = () => {
    const { id: jobId } = useParams(); // Get job ID from URL
    const [job, setJob] = useState(null);
    const [loadingJob, setLoadingJob] = useState(true); // Job loading state
    const { isAuthorized, loading, user } = useContext(AuthContext); // Get user data
    const [open, setOpen] = useState(false); // Dialog state

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            coverLetter: "",
        },
    });   
    
    useEffect(() => {
        if (!jobId) {
            console.error("Job ID is missing in URL");
            return;
        }

        const fetchJob = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/jobs/getajob/${jobId}`,
                    { withCredentials: true }
                );

                console.log("Job Data:", response.data);
                setJob(response.data.data);
                setLoadingJob(false);
            } catch (err) {
                console.error("Failed to fetch job details:", err.response?.data || err.message);
                setLoadingJob(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleSubmit = async (values) => {
        if (!user || !user._id) {
            console.error("User data is missing in AuthContext.");
            return;
        }
    
        console.log("User ID:", user._id);
        console.log("Job ID:", jobId);
        console.log("Form values:", values);
    
        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/application/sendapplication`,
                {
                    ...values,  
                    jobId,      // Ensure Job ID is included
                    userId: user._id,  // Ensure User ID is included
                },
                { withCredentials: true }
            );
    
            console.log("Application response:", response.data);
            setOpen(false);
            toast("Application submitted successfully!");
        } catch (err) {
            console.error("Failed to submit application:", err.response?.data || err.message);
        }
    };

    // Wait until both job and auth checks are done
    if (loading || loadingJob) return <div className="text-center">Loading...</div>;

    // If not authorized, show message
    if (!isAuthorized) {
        return <div className="text-center text-red-500 font-bold">Please login first</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                {job ? (
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h1 className="text-gray-800 text-3xl font-bold">{job.title}</h1>
                        <p className="text-sm text-gray-600">Company: {job.companyname}</p>
                        <p className="text-gray-600">Location: {job.city}, {job.country}</p>
                        <p className="text-gray-800 mt-2">{job.description}</p>
                        <p className="text-gray-800">Salary: {job.salary}</p>
                        <p className="text-gray-800">Type: {job.type}</p>

                        {/* Apply Button with Dialog Trigger */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Apply</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Apply for {job.title}</DialogTitle>
                                </DialogHeader>
                                <p className="text-gray-600">Submit your application for {job.companyname}.</p>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(handleSubmit)}
                                        className="max-w-md w-full flex flex-col gap-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Full Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Email address" type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Phone Number" type="tel" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="coverLetter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cover Letter</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Cover Letter" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full">
                                            Submit
                                        </Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <div className="text-red-500 font-bold text-center">Job not found</div>
                )}
            </div>
        </>
    );
};

export default JobProfile;
