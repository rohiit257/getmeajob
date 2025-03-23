"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios"; // Import axios
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Define validation schema using zod
const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  role: z.enum(["JobSeeker", "Employer"]),
});

const LoginPage = () => {
  const { setUser, setIsAuthorized } = useContext(AuthContext); // Use AuthContext
  const router = useRouter(); // For redirection
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Initialize form using react-hook-form with zod schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "JobSeeker", // Default to "JobSeeker"
    },
  });

  // Form submission handler
  const handleSubmit = async (values) => {
    setIsSubmitting(true); // Start loading
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        values,
        { withCredentials: true } // Ensure credentials (cookies) are sent
      );

      if (response.data.user) {
        setUser(response.data.user); // Set user data in context
        setIsAuthorized(true); // Mark user as authorized
        toast.success("Login successful! Redirecting...");

        // Redirect to dashboard after successful login
        router.push("/Jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
      setIsAuthorized(false);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)} // react-hook-form handle submit
          className="max-w-md w-full flex flex-col gap-4"
        >
          {/* Email Field */}
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JobSeeker">Job Seeker</SelectItem>
                    <SelectItem value="Employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default LoginPage;