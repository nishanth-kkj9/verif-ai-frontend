import { client } from './client';

export interface Notification {
  id: string;
  type: 'application' | 'verification' | 'job' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export const notificationsApi = {
  getAll: async (): Promise<{ success: boolean; data: NotificationsResponse }> => {
    const response = await client.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    const response = await client.patch('/notifications/read-all');
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await client.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Mock data for development
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'verification',
    title: 'Certificate Verified',
    message: 'Your AWS Solutions Architect certificate has been verified successfully.',
    read: false,
    created_at: new Date().toISOString(),
    link: '/my-documents',
  },
  {
    id: '2',
    type: 'application',
    title: 'Application Update',
    message: 'Your application for Software Engineer at TechCorp has been reviewed.',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    link: '/my-applications',
  },
  {
    id: '3',
    type: 'job',
    title: 'New Job Match',
    message: '3 new backend developer positions match your skills.',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    link: '/discover',
  },
  {
    id: '4',
    type: 'system',
    title: 'Trust Score Updated',
    message: 'Your trust score has been updated to 85 based on verified credentials.',
    read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];