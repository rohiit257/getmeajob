'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import JobCard from '../components/JobCard/JobCard'
import { Navbar } from '../components/Navbar'
import { AuthContext } from '@/context/AuthContext'
function page() {

    const[loading ,setLoading] = useState(true)
    const[job,setJob ] = useState([])
    const[error,setError] = useState(null)

    const { isAuthorized } = useContext(AuthContext);

    useEffect(()=>{
        const fetchJobs = async () =>{
            try {
                const resp = await axios.get("http://localhost:8000/api/v1/jobs/getalljobs")
                setJob(resp.data.data)
                setLoading(false)
                
            } catch (error) {
                console.log(error);
                setError("Error Fetching Jobs")
                setLoading(false)
                
            }
        }
        fetchJobs()
    },[])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if(!isAuthorized) return <p>login required</p>


  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {job.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    </>
  )
}

export default page