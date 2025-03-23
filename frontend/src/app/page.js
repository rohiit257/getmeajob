'use client'
import Image from "next/image";
import { Navbar } from "./components/Navbar";
import { useContext, useEffect } from "react";
import axios from "axios"; // Make sure to import axios
import { AuthContext } from "@/context/AuthContext";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { TypewriterEffectSmoothDemo } from "./components/Hero";

export default function Home() {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(AuthContext);
  const router = useRouter()

 
    
  // if(!isAuthorized){
  //   router.push('/auth/login')
  // }
  
 
  return (
    <div>
      <Navbar />
      <TypewriterEffectSmoothDemo/>
      {/* You can add more content here based on user role or status */}
    </div>
  );
}
