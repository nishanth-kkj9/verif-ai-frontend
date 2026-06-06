import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Loader2,
  Trash2,
  Plus,
  ChevronRight,
  MapPin,
  Clock,
  Building2
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { jobsApi } from '../api/jobs';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const PostedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [companyName, setCompanyName] = useState('Your Company');

  const { loading: authLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const response = await jobsApi.getMyJobs();
        if (response.success) {
          setPostedJobs(response.data);
        }
      } catch (error: any) {
        console.error('Failed to load jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authLoading) return;
    if (!isAuthenticated) return;
    loadJobs();
  }, [authLoading, isAuthenticated]);

  const handlePostJob = async () => {
    if (!jobTitle || !jobDescription) {
      toast.error('Please fill in required fields');
      return;
    }
    setIsPostingJob(true);
    try {
      await jobsApi.createJob({
        title: jobTitle,
        company_name: companyName,
        location: jobLocation,
        job_type: jobType,
        salary_range: jobSalary,
        skills: jobSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: jobDescription,
      });
      toast.success('Job posted successfully!');
      setShowPostForm(false);
      setJobTitle('');
      setJobDescription('');
      setJobLocation('');
      setJobSalary('');
      setJobSkills('');

      // Reload jobs
      const response = await jobsApi.getMyJobs();
      if (response.success) {
        setPostedJobs(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleDeleteJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this job? This will also delete all applications for this job.')) {
      return;
    }
    setDeletingJobId(jobId);
    try {
      await jobsApi.deleteJob(jobId);
      setPostedJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job');
    } finally {
      setDeletingJobId(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-2xl">
              <Briefcase className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
              <p className="text-sm text-gray-500">Manage your job listings</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setShowPostForm(!showPostForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Post Job Form */}
        {showPostForm && (
          <Card bordered className="rounded-2xl overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="font-bold text-blue-700">Post a New Job</h3>
            </div>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. ₹20-30 LPA"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Node.js"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  placeholder="Describe the role..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowPostForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePostJob} isLoading={isPostingJob} className="flex-1">
                  Post Job
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Jobs List */}
        {postedJobs.length > 0 ? (
          <Card bordered className="rounded-2xl overflow-hidden">
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {postedJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {job.company_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location || 'Remote'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.job_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={job.is_active ? "success" : "secondary"} size="sm">
                        {job.is_active ? "Active" : "Closed"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        isLoading={deletingJobId === job.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card bordered className="rounded-2xl">
            <CardBody className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No posted jobs yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Post New Job" to create your first job listing</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PostedJobsPage;