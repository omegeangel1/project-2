import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, UserMinus, Search, Download, Crown, Calendar } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

interface UserManagementProps {
  theme?: string;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  discordTag?: string;
  role: 'user' | 'admin';
  createdAt: any;
  lastLogin?: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ theme = 'dark' }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900'
        };
      default:
        return {
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.discordTag?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    if (!currentUser?.isSuperAdmin) {
      alert('Only super admins can change user roles');
      return;
    }

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const exportUsers = () => {
    const csv = [
      ['Email', 'Display Name', 'Discord Tag', 'Role', 'Created At'].join(','),
      ...filteredUsers.map(user => [
        user.email,
        user.displayName || '',
        user.discordTag || '',
        user.role,
        user.createdAt ? format(user.createdAt.toDate(), 'yyyy-MM-dd') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-3xl font-bold ${themeStyles.text}`}>User Management</h1>
        <button
          onClick={exportUsers}
          className={`${themeStyles.button} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2`}
        >
          <Download className="w-4 h-4" />
          <span>Export Users</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className={`${themeStyles.card} p-4 rounded-xl border`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted} w-5 h-5`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by email, name, or Discord tag..."
                className={`w-full pl-10 pr-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>
        </div>

        <div className={`${themeStyles.card} p-4 rounded-xl border`}>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${themeStyles.text}`}>{filteredUsers.length}</span>
          </div>
          <h3 className={`font-semibold ${themeStyles.text} mt-2`}>Total Users</h3>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${themeStyles.card} rounded-2xl border overflow-hidden`}>
        <div className="p-6 border-b border-white/10">
          <h3 className={`text-xl font-bold ${themeStyles.text}`}>All Users</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>User</th>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Email</th>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Discord</th>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Role</th>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Created</th>
                <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                      <span className={themeStyles.textMuted}>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`p-8 text-center ${themeStyles.textMuted}`}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className={`font-medium ${themeStyles.text}`}>
                            {user.displayName || 'No name'}
                          </p>
                          <p className={`text-xs ${themeStyles.textMuted} font-mono`}>
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`p-4 ${themeStyles.textSecondary}`}>
                      {user.email}
                    </td>
                    <td className={`p-4 ${themeStyles.textSecondary} font-mono text-sm`}>
                      {user.discordTag || 'Not connected'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : (
                          <Users className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className={`p-4 ${themeStyles.textSecondary} text-sm`}>
                      {user.createdAt ? format(user.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="p-4">
                      {currentUser?.isSuperAdmin && user.id !== currentUser.uid && (
                        <button
                          onClick={() => toggleUserRole(user.id, user.role)}
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                            user.role === 'admin'
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <UserMinus className="w-3 h-3 mr-1" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" />
                              Make Admin
                            </>
                          )}
                        </button>
                      )}
                      {user.id === currentUser?.uid && (
                        <span className={`text-xs ${themeStyles.textMuted}`}>Current User</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Info */}
      {currentUser?.isSuperAdmin && (
        <div className={`mt-8 ${themeStyles.card} p-6 rounded-2xl border`}>
          <h3 className={`text-lg font-bold ${themeStyles.text} mb-4 flex items-center`}>
            <Shield className="w-5 h-5 mr-2" />
            Role Management
          </h3>
          <div className="space-y-2 text-sm">
            <p className={themeStyles.textSecondary}>
              • <strong>Super Admin:</strong> Can promote/demote users and access all features
            </p>
            <p className={themeStyles.textSecondary}>
              • <strong>Admin:</strong> Can view dashboard and manage orders
            </p>
            <p className={themeStyles.textSecondary}>
              • <strong>User:</strong> Regular user with no admin access
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;