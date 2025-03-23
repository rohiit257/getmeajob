'use client';

import React, { useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AuthContext } from "@/context/AuthContext"; // Import the AuthContext
import axios from "axios"; // Import axios for API calls
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { ModeToggle } from "./Togglebtn";

export function Navbar() {
  const { user, isAuthorized, setIsAuthorized, setUser } = useContext(AuthContext); // Access context
  const router = useRouter(); // Use router for navigation

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true, // Ensures cookies are sent
      });
  
      console.log("Logout successful:", response.data);
  
      // Clear auth-related data from storage
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
  
      // Reset authentication state
      setIsAuthorized(false);
      setUser(null);
  
      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };
  
  
  

  return (
    <div className="flex justify-between items-center p-4">
      <NavigationMenu>
        <NavigationMenuList className="flex justify-center">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Jobs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/Jobs" title="Find Jobs">
                  Explore the available job opportunities.
                </ListItem>

                {/* Conditional rendering based on user role */}
                {isAuthorized && user?.role === "Employer" && (
                  <>
                    <ListItem href="/employer/post-job" title="Post a Job">
                      Post a job for job seekers to apply.
                    </ListItem>
                    <ListItem href="/employer/my-jobs" title="My Jobs">
                      View and manage the jobs you've posted.
                    </ListItem>
                  </>
                )}

                {isAuthorized && user?.role === "JobSeeker" && (
                  <ListItem href="/user" title="My Applications">
                    Track the jobs you have applied for.
                  </ListItem>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ModeToggle />

      {/* Logout button visible when authorized */}
      {isAuthorized ? (
        <Button variant="outline" className="ml-auto" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Link href="/auth/login">
          <Button variant="outline" className="ml-auto">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}

// Reusable ListItem component
const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
