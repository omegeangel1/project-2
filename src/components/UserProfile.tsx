import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, MessageCircle, Calendar, Shield, Crown, Star, Settings, LogOut, Copy, CheckCircle, Package, Clock, ExternalLink } from 'lucide-react';
import { authManager, type AuthState } from '../utils/auth';
import { superDatabase } from '../utils/database';

interface UserProfileProps {
  theme?: string;
  onBack: () => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ theme = 'dark', onBack, onLogout }) => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());
  const [copied, setCopied] = useState(false);
  const [userPurchases, setUserPurchases] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    
    // Load user purchases and orders
    if (authState.isAuthenticated && authState.user) {
      const user = superDatabase.getUserByDiscordId(authState.user.id);
      if (user) {
        setUserPurchases(user.purchases);
        
        // Get all orders for this user
        const allOrders = superDatabase.getAllOrders();
        const userOrdersList = allOrders.filter(order => order.userId === user.id);
        setUserOrders(userOrdersList);
      }
    }
    
    return unsubscribe;
  }, [authState]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      default:
        return <Package className="w-3 h-3 mr-1" />;
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
                  <span className={`text-sm font-semibold ${themeStyles.text}`}>
                    {superDatabase.getUserByDiscordId(authState.user.id)?.membershipType === 'premium' ? 'Premium Member' : 'Normal Member'}
                  </span>
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

            {/* Order Status */}
            <div className={`${themeStyles.card} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6 flex items-center`}>
                <Package className="w-5 h-5 mr-2" />
                Order Status & History
              </h3>

              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                      <div className="text-2xl font-bold text-blue-400 mb-1">{userOrders.length}</div>
                      <div className={`text-sm ${themeStyles.textMuted}`}>Total Orders</div>
                    </div>
                    <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {userOrders.filter(order => order.status === 'confirmed').length}
                      </div>
                      <div className={`text-sm ${themeStyles.textMuted}`}>Confirmed</div>
                    </div>
                    <div className={`${themeStyles.card} p-4 rounded-xl border text-center`}>
                      <div className="text-2xl font-bold text-yellow-400 mb-1">
                        {userOrders.filter(order => order.status === 'pending').length}
                      </div>
                      <div className={`text-sm ${themeStyles.textMuted}`}>Pending</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {userOrders.slice(0, 5).map((order, index) => (
                      <div key={index} className={`${themeStyles.card} p-4 rounded-xl border`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className={`font-semibold ${themeStyles.text} capitalize`}>
                                {order.type} - {order.planName}
                              </h5>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </div>
                            <p className={`text-sm ${themeStyles.textSecondary} mb-1`}>{order.price}</p>
                            <p className={`text-xs ${themeStyles.textMuted}`}>
                              Order ID: #{order.orderId}
                            </p>
                            <p className={`text-xs ${themeStyles.textMuted}`}>
                              Ordered: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {order.status === 'pending' && (
                              <div className={`text-xs ${themeStyles.textMuted} mb-2`}>
                                <Clock className="w-3 h-3 inline mr-1" />
                                Awaiting confirmation
                              </div>
                            )}
                            {order.status === 'confirmed' && (
                              <div className={`text-xs text-green-400 mb-2`}>
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Active
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {userOrders.length > 5 && (
                      <div className={`text-center ${themeStyles.textMuted} text-sm`}>
                        And {userOrders.length - 5} more orders...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`${themeStyles.card} p-6 rounded-xl border text-center`}>
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className={`font-semibold ${themeStyles.text} mb-2`}>No Orders Yet</h4>
                  <p className={`text-sm ${themeStyles.textMuted}`}>
                    You haven't placed any orders yet. Browse our plans to get started!
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`${themeStyles.card} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6 flex items-center`}>
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://discord.gg/Qy6tuNJmwJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeStyles.button} text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-left block`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Join Discord</div>
                      <div className="text-xs opacity-80">Get support & updates</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </div>
                </a>

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
