import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  theme?: string;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ theme = 'dark', onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = 'jxfr45';

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/90 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          input: 'bg-white/10 border-white/20 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Invalid admin password');
    }

    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4 relative`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 text-center border shadow-2xl relative z-10`}>
        {/* Logo and Branding */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="/05b5bc0e84997d92e62826cfce30b63a.webp" 
              alt="Demon Node Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${themeStyles.text}`}>Demon Node™</h1>
            <p className={`text-sm ${themeStyles.textMuted}`}>Admin Panel</p>
          </div>
        </div>

        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
          <Shield className="w-8 h-8 text-white" />
        </div>

        <h2 className={`text-3xl font-bold ${themeStyles.text} mb-4`}>
          Admin Access
        </h2>
        
        <p className={`${themeStyles.textSecondary} mb-8`}>
          Enter the admin password to access the control panel
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full px-4 py-4 ${themeStyles.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Access Admin Panel</span>
              </>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className={`mt-6 ${themeStyles.textSecondary} hover:text-purple-400 transition-colors text-sm`}
        >
          ← Back to Home
        </button>

        <div className={`${themeStyles.card} p-4 rounded-xl border mt-6`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className={`font-semibold ${themeStyles.text} text-sm`}>Secure Access</span>
          </div>
          <p className={`text-xs ${themeStyles.textMuted}`}>
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;