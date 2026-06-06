import React from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/authStore';

const RecruiterHomePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Select an option from the sidebar to get started</p>
      </div>
    </Layout>
  );
};

export default RecruiterHomePage;