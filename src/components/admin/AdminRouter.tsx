import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminRouterProps {
  theme?: string;
}

const AdminRouter: React.FC<AdminRouterProps> = ({ theme = 'dark' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin theme={theme} />;
  }

  return <AdminDashboard />;
};

export default AdminRouter;