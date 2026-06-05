import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface JobCardProps {
  companyLogoInitials: string;
  companyName: string;
  timeAgo: string;
  jobTitle: string;
  location: string;
  jobType: string;
  skills: string[];
  salaryRange: string;
  animationDelay: string;
}

const JobCard: React.FC<JobCardProps> = ({
  companyLogoInitials,
  companyName,
  timeAgo,
  jobTitle,
  location,
  jobType,
  skills,
  salaryRange,
  animationDelay,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 shadow-sm shadow-indigo-50 transition duration-200 cursor-pointer animate-fade-slide-up ${animationDelay}`}
      style={{ animationDelay }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-sm">
            {companyLogoInitials}
          </div>
          <span className="text-sm text-slate-500">{companyName}</span>
        </div>
        <span className="text-xs text-slate-400">{timeAgo}</span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mt-2">{jobTitle}</h3>

      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{jobType}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-medium text-emerald-600">{salaryRange}</span>
        <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
