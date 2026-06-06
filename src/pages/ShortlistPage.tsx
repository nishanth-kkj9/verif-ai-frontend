import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ExternalLink,
  Loader2,
  User,
  Bot,
  Sparkles,
  ChevronRight,
  Github,
  Linkedin,
  Globe,
  Mail,
  FileText,
  Award,
  Code,
  Trash2
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { discoverApi } from '../api/discover';
import { applicationsApi } from '../api/applications';
import { PublicProfile } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

type TabType = 'profile' | 'ai-analysis';

const ShortlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<PublicProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { loading: authLoading, isAuthenticated } = useAuthStore();

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    const loadShortlisted = async () => {
      setIsLoading(true);
      try {
        const response = await discoverApi.getShortlist();
        let studentsData = [];
        if (Array.isArray(response)) {
          studentsData = response;
        } else if (response.success && response.data) {
          studentsData = response.data.students || response.data || [];
        } else if (response.data && Array.isArray(response.data)) {
          studentsData = response.data;
        }
        setStudents(studentsData);
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0]);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load shortlisted students');
      } finally {
        setIsLoading(false);
      }
    };
    if (authLoading) return;
    if (!isAuthenticated) return;
    loadShortlisted();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (selectedStudent) {
      setAiAnalysis('');
      setHasAnalyzed(false);
    }
  }, [selectedStudent]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await discoverApi.removeFromShortlist(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
      toast.success('Removed from shortlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from shortlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejectingId(id);
    try {
      // Find the application for this student and delete it
      const appResponse = await applicationsApi.getApplications();
      if (appResponse.success && appResponse.data) {
        const app = appResponse.data.find((a: any) => a.student_id === id);
        if (app) {
          await applicationsApi.deleteApplication(app.id);
        }
      }
      // Also remove from shortlist
      await discoverApi.removeFromShortlist(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
      toast.success('Student rejected and removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject student');
    } finally {
      setRejectingId(null);
    }
  };

  const handleViewProfile = (student: PublicProfile) => {
    setSelectedStudent(student);
    setActiveTab('profile');
  };

  const handleAnalyzeProfile = async () => {
    if (!selectedStudent) return;

    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      // Simulate AI analysis with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysisText = `
## AI Profile Analysis for ${selectedStudent.display_name}

### Overall Assessment
Based on the verified credentials and documents, this candidate demonstrates a **${selectedStudent.trust_score.level} trust rating** with a score of ${selectedStudent.trust_score.score}/100.

### Strengths
- Strong skill foundation with ${selectedStudent.skills?.length || 0} verified skills
- ${selectedStudent.trust_score.breakdown.resume_verification}% resume verification rate
- ${selectedStudent.trust_score.breakdown.certificate_verification}% certificate verification rate
- ${selectedStudent.trust_score.breakdown.github_validation}% GitHub validation rate

### Skill Analysis
${selectedStudent.skills?.map(s => `- ${s}`).join('\n') || 'No skills listed'}

### Recommendations
1. **Resume Review**: ${selectedStudent.trust_score.breakdown.resume_verification >= 80 ? 'Strong verification - proceed with confidence' : 'Consider requesting additional documentation'}
2. **Certificate Check**: ${selectedStudent.trust_score.breakdown.certificate_verification >= 80 ? 'All certificates verified successfully' : 'Verify authenticity of listed certifications'}
3. **GitHub Activity**: ${selectedStudent.trust_score.breakdown.github_validation >= 80 ? 'Active and validated GitHub profile' : 'Review commit history and project contributions'}

### Hiring Insight
${selectedStudent.trust_score.level === 'excellent' || selectedStudent.trust_score.level === 'high'
  ? 'This candidate appears to be a strong match. Recommend proceeding to interview stage.'
  : selectedStudent.trust_score.level === 'medium'
  ? 'This candidate shows potential but may require additional verification. Consider a technical assessment.'
  : 'Further verification recommended before making a hiring decision.'}

### Risk Assessment
${100 - selectedStudent.trust_score.score}% risk factor based on unverified credentials.
      `.trim();

      setAiAnalysis(analysisText);
      setHasAnalyzed(true);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenGitHub = () => {
    if (selectedStudent?.github_url) {
      window.open(selectedStudent.github_url, '_blank');
    } else {
      toast.error('GitHub URL not available');
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Shortlist</h1>
          <p className="text-gray-500 mt-2">
            Students you have shortlisted for your opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Student List */}
          <div className="lg:col-span-1 space-y-4">
            <Card bordered>
              <CardHeader>
                <h3 className="font-bold text-gray-900">Shortlisted Students</h3>
                <p className="text-xs text-gray-500 mt-1">{students.length} students</p>
              </CardHeader>
              <CardBody className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                {students.length > 0 ? (
                  students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleViewProfile(student)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {student.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={student.display_name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {student.display_name.split(' ').map((n) => n.charAt(0)).join('')}
                          </div>
                        )}
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">{student.display_name}</p>
                          <p className="text-xs text-gray-500">Score: {student.trust_score.score}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 ${selectedStudent?.id === student.id ? 'text-blue-500' : ''}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students shortlisted</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Content - Profile Details or AI Analysis */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Tabs */}
                <div className="flex gap-0 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-6 py-3 font-semibold text-sm transition-all rounded-lg flex items-center justify-center gap-2 ${
                      activeTab === 'profile'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`} />
                    Student Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-analysis')}
                    className={`flex-1 px-6 py-3 font-semibold text-sm transition-all rounded-lg flex items-center justify-center gap-2 ${
                      activeTab === 'ai-analysis'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Bot className={`w-4 h-4 ${activeTab === 'ai-analysis' ? 'text-purple-600' : 'text-gray-400'}`} />
                    AI Analysis
                  </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Profile Header Card */}
                    <Card bordered>
                      <CardBody>
                        <div className="flex items-start gap-4">
                          {selectedStudent.avatar_url ? (
                            <img
                              src={selectedStudent.avatar_url}
                              alt={selectedStudent.display_name}
                              className="h-24 w-24 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                              {selectedStudent.display_name.split(' ').map((n) => n.charAt(0)).join('')}
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.display_name}</h2>
                                <p className="text-gray-500 mt-1">Verified Student</p>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold text-blue-500">{selectedStudent.trust_score.score}</div>
                                <Badge
                                  variant={
                                    selectedStudent.trust_score.level === 'excellent'
                                      ? 'success'
                                      : selectedStudent.trust_score.level === 'high'
                                      ? 'success'
                                      : selectedStudent.trust_score.level === 'medium'
                                      ? 'warning'
                                      : 'error'
                                  }
                                  size="md"
                                >
                                  {selectedStudent.trust_score.level}
                                </Badge>
                              </div>
                            </div>

                            {selectedStudent.bio && (
                              <p className="text-gray-600 mt-4">{selectedStudent.bio}</p>
                            )}
                          </div>
                        </div>

                        {/* Trust Score Breakdown */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                              <FileText className="w-3 h-3" />
                              Resume Verification
                            </div>
                            <div className="text-xl font-bold text-gray-900">{selectedStudent.trust_score.breakdown.resume_verification}%</div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                              <Award className="w-3 h-3" />
                              Certificate Verification
                            </div>
                            <div className="text-xl font-bold text-gray-900">{selectedStudent.trust_score.breakdown.certificate_verification}%</div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                              <Code className="w-3 h-3" />
                              GitHub Validation
                            </div>
                            <div className="text-xl font-bold text-gray-900">{selectedStudent.trust_score.breakdown.github_validation}%</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Skills Section */}
                    {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                      <Card bordered>
                        <CardHeader>
                          <h3 className="text-lg font-bold text-gray-900">Skills & Expertise</h3>
                        </CardHeader>
                        <CardBody>
                          <div className="flex flex-wrap gap-2">
                            {selectedStudent.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" size="md">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    )}

                    {/* Connect Section */}
                    <Card bordered>
                      <CardHeader>
                        <h3 className="text-lg font-bold text-gray-900">Connect</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="flex gap-3 flex-wrap">
                          <Button variant="ghost" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Send Message
                          </Button>
                          {selectedStudent.github_url && (
                            <Button variant="ghost" onClick={handleOpenGitHub} className="flex items-center gap-2">
                              <Github className="h-4 w-4" />
                              GitHub
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          {selectedStudent.linkedin_url && (
                            <Button variant="ghost" className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                            </Button>
                          )}
                          {selectedStudent.portfolio_url && (
                            <Button variant="ghost" className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Portfolio
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={() => handleRemove(selectedStudent.id)}
                        isLoading={removingId === selectedStudent.id}
                      >
                        Remove from Shortlist
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(selectedStudent.id)}
                        isLoading={rejectingId === selectedStudent.id}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Analysis Tab */}
                {activeTab === 'ai-analysis' && (
                  <div className="space-y-6">
                    <Card bordered>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-bold text-gray-900">AI Profile Analysis</h3>
                          </div>
                          {!hasAnalyzed && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleAnalyzeProfile}
                              isLoading={isAnalyzing}
                              disabled={isAnalyzing}
                            >
                              <Bot className="w-4 h-4 mr-2" />
                              {isAnalyzing ? 'Analyzing...' : 'Analyze Profile'}
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Let AI analyze {selectedStudent.display_name}'s complete profile and provide insights
                        </p>
                      </CardHeader>
                      <CardBody>
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">AI is analyzing the profile...</p>
                            <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
                          </div>
                        ) : aiAnalysis ? (
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                            <div className="prose prose-sm max-w-none">
                              <div className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {aiAnalysis}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                              <Bot className="w-8 h-8 text-purple-500" />
                            </div>
                            <p className="text-gray-500 font-medium mb-2">Ready for Analysis</p>
                            <p className="text-gray-400 text-sm max-w-md">
                              Click "Analyze Profile" to get AI-powered insights about this candidate's verification status, skills assessment, and hiring recommendations.
                            </p>
                          </div>
                        )}
                      </CardBody>
                    </Card>

                    {hasAnalyzed && (
                      <div className="flex justify-end">
                        <Button
                          variant="secondary"
                          onClick={handleAnalyzeProfile}
                          isLoading={isAnalyzing}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Re-analyze Profile
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Card bordered>
                <CardBody className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Select a student to view details</p>
                  <p className="text-gray-400 text-sm mt-2">Choose from the list on the left to see their profile and AI analysis</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShortlistPage;
