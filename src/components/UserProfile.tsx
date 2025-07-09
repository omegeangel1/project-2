import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, MessageCircle, Calendar, Shield, Crown, Star, Settings, LogOut, Copy, CheckCircle } from 'lucide-react';
import { authManager, type AuthState } from '../utils/auth';

interface UserProfileProps {
  theme?: string;
  onBack: () => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ theme = 'dark', onBack, onLogout }) => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

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
          dangerButton: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80',
          dangerButton: 'bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600/80 hover:to-pink-600/80'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          dangerButton: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    authManager.clearAuth();
    if (onLogout) {
      onLogout();
    }
  };

  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className={`${themeStyles.card} p-8 rounded-2xl text-center border`}>
          <h2 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Not Logged In</h2>
          <p className={`${themeStyles.textSecondary} mb-6`}>Please log in to view your profile</p>
          <button
            onClick={onBack}
            className={`${themeStyles.button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user } = authState;
  const joinDate = new Date(parseInt(user.id) / 4194304 + 1420070400000);

  return (
    <div className={`min-h-screen ${themeStyles.bg} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors mb-6`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className={`lg:col-span-1 ${themeStyles.card} rounded-2xl p-6 border h-fit`}>
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <img 
                  src={authManager.getAvatarUrl()} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>
                {user.global_name || user.username}
              </h2>

              <div className="flex items-center justify-center space-x-2 mb-4">
                <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                <span className={`${themeStyles.textSecondary} font-mono text-sm`}>
                  {authManager.getDiscordUsername()}
                </span>
                <button
                  onClick={() => copyToClipboard(authManager.getDiscordUsername())}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Copy Discord username"
                >
                  <Copy className="w-3 h-3 text-gray-400" />
                </button>
              </div>

              {copied && (
                <p className="text-green-400 text-xs mb-4">Copied to clipboard!</p>
              )}

              <div className={`${themeStyles.card} p-3 rounded-xl border mb-6`}>
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className={`text-sm font-semibold ${themeStyles.text}`}>Premium Member</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className={`w-full ${themeStyles.dangerButton} text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className={`${themeStyles.card} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6 flex items-center`}>
                <User className="w-5 h-5 mr-2" />
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    Display Name
                  </label>
                  <div className={`${themeStyles.card} p-3 rounded-lg border`}>
                    <span className={themeStyles.text}>{user.global_name || 'Not set'}</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    Username
                  </label>
                  <div className={`${themeStyles.card} p-3 rounded-lg border`}>
                    <span className={`${themeStyles.text} font-mono`}>{user.username}</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    Email Address
                  </label>
                  <div className={`${themeStyles.card} p-3 rounded-lg border flex items-center space-x-2`}>
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className={themeStyles.text}>{user.email}</span>
                    {user.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" title="Verified" />
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    Discord ID
                  </label>
                  <div className={`${themeStyles.card} p-3 rounded-lg border flex items-center space-x-2`}>
                    <span className={`${themeStyles.text} font-mono text-sm`}>{user.id}</span>
                    <button
                      onClick={() => copyToClipboard(user.id)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy Discord ID"
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    Account Created
                  </label>
                  <div className={`${themeStyles.card} p-3 rounded-lg border flex items-center space-x-2`}>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={themeStyles.text}>{joinDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className={`${themeStyles.card} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6 flex items-center`}>
                <Shield className="w-5 h-5 mr-2" />
                Account Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className={`font-semibold ${themeStyles.text} mb-1`}>Verified</h4>
                  <p className={`text-xs ${themeStyles.textMuted}`}>Email verified</p>
                </div>

                <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className={`font-semibold ${themeStyles.text} mb-1`}>Premium</h4>
                  <p className={`text-xs ${themeStyles.textMuted}`}>Active member</p>
                </div>

                <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                  <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className={`font-semibold ${themeStyles.text} mb-1`}>Trusted</h4>
                  <p className={`text-xs ${themeStyles.textMuted}`}>Good standing</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${themeStyles.card} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6 flex items-center`}>
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className={`${themeStyles.button} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-left`}>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Join Discord</div>
                      <div className="text-xs opacity-80">Get support & updates</div>
                    </div>
                  </div>
                </button>

                <button className={`${themeStyles.button} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-left`}>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Security Settings</div>
                      <div className="text-xs opacity-80">Manage your account</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;