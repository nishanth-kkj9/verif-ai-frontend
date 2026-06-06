import client from './client';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  location?: string;
  job_type: string;
  salary_range?: string;
  skills?: string[];
  description: string;
  created_at: string;
  is_active: boolean;
  recruiter_id: string;
}

// Frontend interface for creating a job, mirrors backend JobCreate
export interface JobCreate {
  title: string;
  company_name: string;
  location?: string;
  job_type?: string; // Optional as backend has default
  salary_range?: string;
  skills?: string[];
  description: string;
}

export const jobsApi = {
  /**
   * Create a new job posting
   */
  createJob: async (jobData: JobCreate): Promise<Job> => {
    try {
      const response = await client.post('/api/v1/jobs', jobData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a job posting (recruiter only)
   */
  deleteJob: async (jobId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.delete(`/api/v1/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get jobs posted by the recruiter (recruiter only)
   */
  getMyJobs: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await client.get('/api/v1/jobs/my');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all available jobs for students
   */
  getJobs: async (): Promise<{ success: boolean; data: Job[] }> => {
    try {
      const response = await client.get('/api/v1/jobs');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId: string): Promise<{ success: boolean; message: string }> => {
  try {
    // ✅ Was: /api/v1/applications  — doesn't exist
    // ✅ Fix: matches backend route POST /{job_id}/apply
    const response = await client.post(`/api/v1/jobs/${jobId}/apply`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
},

  /**
   * Get my applications (student)
   */
  getMyApplications: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await client.get('/api/v1/applications/my');
      return response.data;
    } catch (error: any) {
      return { success: true, data: [] };
    }
  },
};