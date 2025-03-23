"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user session on page load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/user/getuser", {
          withCredentials: true,
        });

        console.log("User check response:", response.data);

        // Check for user data in the correct location
        if (response.data.data) {
          setUser(response.data.data); // Set user data
          setIsAuthorized(true); // Mark user as authorized
          console.log("User is authorized:", response.data.data);
        } else {
          setIsAuthorized(false);
          setUser(null);
          console.log("No user found in session.");
        }
      } catch (error) {
        console.error("Failed to check user:", error);
        setIsAuthorized(false);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("Authentication check complete.");
      }
    };

    checkUser();
  }, []);

  // Provide the context value
  const contextValue = {
    user,
    isAuthorized,
    setIsAuthorized,
    setUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children} {/* Always render children */}
    </AuthContext.Provider>
  );
};