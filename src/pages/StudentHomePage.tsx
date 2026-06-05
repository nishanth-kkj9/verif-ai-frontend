import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import SearchBar from '../components/student/SearchBar';
import FiltersRow from '../components/student/FiltersRow';
import JobCard from '../components/student/JobCard';
import ProfileSidebar from '../components/student/ProfileSidebar';

const MOCK_JOB_DATA = [
  {
    companyLogoInitials: 'G',
    companyName: 'Google',
    timeAgo: '2h ago',
    jobTitle: 'Senior Frontend Engineer',
    location: 'Bangalore, India',
    jobType: 'Remote',
    skills: ['React', 'TypeScript', 'Node.js'],
    salaryRange: '₹40-60 LPA',
  },
  {
    companyLogoInitials: 'F',
    companyName: 'Flipkart',
    timeAgo: '5h ago',
    jobTitle: 'Data Analyst Intern',
    location: 'Bangalore, India',
    jobType: 'Hybrid',
    skills: ['Python', 'SQL', 'Pandas'],
    salaryRange: '₹8-12 LPA',
  },
  {
    companyLogoInitials: 'R',
    companyName: 'Razorpay',
    timeAgo: '1d ago',
    jobTitle: 'Backend Developer',
    location: 'Remote',
    jobType: 'Full-time', // Assuming full-time based on context
    skills: ['FastAPI', 'PostgreSQL', 'Docker'],
    salaryRange: '₹25-35 LPA',
  },
  {
    companyLogoInitials: 'S',
    companyName: 'Swiggy',
    timeAgo: '2d ago',
    jobTitle: 'ML Engineer',
    location: 'Bangalore, India',
    jobType: 'On-site',
    skills: ['Python', 'TensorFlow', 'MLflow'],
    salaryRange: '₹30-45 LPA',
  },
];

const StudentHomePage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, this would trigger a data fetch
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* COMPONENT 1: TOP NAV BAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-indigo-600">VERIF-AI</h1>
          <span className="text-sm text-slate-400">Student Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
            PS
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer" />
        </div>
      </nav>

      <div className="flex flex-grow gap-6 p-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 max-w-none flex flex-col gap-6">
          {/* COMPONENT 2: SEARCH BAR */}
          <SearchBar onSearch={handleSearch} />

          {/* COMPONENT 3: FILTERS ROW */}
          <FiltersRow />

          {/* COMPONENT 4: JOB LISTINGS AREA */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Recommended for You</h2>
            <p className="text-sm text-slate-400 mb-4">Based on your verified skills</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {MOCK_JOB_DATA.map((job, index) => (
                <JobCard key={index} {...job} animationDelay={`${index * 100}ms`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default StudentHomePage;
