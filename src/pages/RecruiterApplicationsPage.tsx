import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Users,
  ChevronRight,
  Star,
  Loader2,
  FileText,
  Award,
  Github,
  X
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { applicationsApi } from '../api/applications';
import { discoverApi } from '../api/discover';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  student_id: string;
  student: any;
  job_id: string;
  job_title: string;
  company_name: string;
  applied_at: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

const RecruiterApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const { loading: authLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      try {
        const response = await applicationsApi.getApplications();
        if (response.success) {
          setApplications(response.data);
        }
      } catch (error: any) {
        console.error('Failed to load applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authLoading) return;
    if (!isAuthenticated) return;
    loadApplications();
  }, [authLoading, isAuthenticated]);

  const handleShortlist = async (applicationId: string) => {
    setShortlistingId(applicationId);
    try {
      // Find the application to get student_id
      const app = applications.find(a => a.id === applicationId);
      if (!app) throw new Error('Application not found');

      // Update application status
      await applicationsApi.updateStatus(applicationId, 'shortlisted');

      // Also add to recruiter's shortlist collection
      await discoverApi.shortlist(app.student_id);

      setApplications(prev => prev.map(a =>
        a.id === applicationId ? { ...a, status: 'shortlisted' } : a
      ));
      toast.success('Student shortlisted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to shortlist');
    } finally {
      setShortlistingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!confirm('Are you sure you want to reject this application? It will be removed from your dashboard.')) {
      return;
    }
    setRejectingId(applicationId);
    try {
      await applicationsApi.deleteApplication(applicationId);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      toast.success('Application rejected and removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject application');
    } finally {
      setRejectingId(null);
    }
  };

  const filteredApplications = applications.filter(app =>
    (app.student?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.job_title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="info" size="sm">Reviewed</Badge>;
      case 'shortlisted':
        return <Badge variant="success" size="sm">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="error" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
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
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500">Review student applications</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all shadow-sm"
          />
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <Card bordered className="rounded-2xl overflow-hidden">
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/recruiter/application/${app.id}`, { state: { application: app } })}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {(app.student?.display_name || 'U').split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.student?.display_name || 'Unknown Student'}</h3>
                        <p className="text-sm text-gray-500">{app.job_title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-400">Trust Score: {app.student?.trust_score?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {app.status !== 'shortlisted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShortlist(app.id);
                          }}
                          isLoading={shortlistingId === app.id}
                          className="flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          Shortlist
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(app.id);
                        }}
                        isLoading={rejectingId === app.id}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </Button>
                      {getStatusBadge(app.status)}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
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
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No applications yet</p>
              <p className="text-sm text-gray-400 mt-1">Students who apply to your jobs will appear here</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RecruiterApplicationsPage;