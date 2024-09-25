// components/JobCard.js
import Link from 'next/link';

const JobCard = ({ job }) => {
    return (
        <div className="border rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.companyname}</p>
            <p className="text-sm text-gray-600">{job.category}</p>
            <p className="text-gray-800">{job.country}</p>
            <p className="text-gray-700 mt-2">{job.description}</p>
            <p className="text-gray-700 mt-2">{job.salary}</p>
            <Link href={`/Jobs/${job._id}`}>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                    View
                </button>
            </Link>
        </div>
    );
};

export default JobCard;
