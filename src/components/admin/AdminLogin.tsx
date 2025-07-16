import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLoginProps {
  theme?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ theme = 'dark' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/90 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          input: 'bg-white/10 border-white/20 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
      <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 border shadow-2xl`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${themeStyles.text} mb-2`}>Admin Dashboard</h1>
          <p className={`${themeStyles.textSecondary}`}>JXFRCloud™ Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 ${themeStyles.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 ${themeStyles.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${themeStyles.button} disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className={`mt-6 p-4 ${themeStyles.card} rounded-xl border`}>
          <p className={`text-xs ${themeStyles.textSecondary} text-center`}>
            Only authorized administrators can access this dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
