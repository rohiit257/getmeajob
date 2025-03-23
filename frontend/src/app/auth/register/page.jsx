"use client";

import { useContext } from "react";
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phonenumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  role: z.enum(["JobSeeker", "Employer"]),
});

const RegisterPage = () => {
  const { login } = useContext(AuthContext); // Access login function from context
  const router = useRouter(); // For redirection

  // Initialize form using react-hook-form with zod schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phonenumber: "",
      password: "",
      role: "", // Default to empty
    },
  });

  // Handle form submission and register user
  const handleSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/register", data);
      toast.success("Registration successful! Redirecting...");
      
      // Simulate login after successful registratio

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("auth/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
          
          {/* Name Field */}
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

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phonenumber"
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
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default RegisterPage;
