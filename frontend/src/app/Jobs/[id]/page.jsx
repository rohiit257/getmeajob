// src/app/Jobs/[id]/page.jsx
'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const JobProfile = () => {
    const { id } = useParams(); // Get the job ID from the URL
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/jobs/getajob/${id}`);
                setJob(response.data.data); // Assuming your data structure includes response.data.data
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch job details', err);
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            {job ? (
                <div>
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="text-sm text-gray-600">Company: {job.companyname}</p>
                    <p className="text-gray-600">Location: {job.city}, {job.country}</p>
                    <p className="text-gray-800 mt-2">{job.description}</p>
                    <p className="text-gray-800">Salary: {job.salary}</p>
                    <p className="text-gray-800">Type: {job.type}</p>
                </div>
            ) : (
                <div>Job not found</div>
            )}
        </div>
    );
};

export default JobProfile;
