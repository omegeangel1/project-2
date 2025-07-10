import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, TrendingUp, DollarSign, Eye, EyeOff, Plus, Trash2, Edit, Check, X, RefreshCw, Download, Search, Filter, Calendar, Globe, Server, Crown, Shield, Zap, Tag, Gift, BarChart3, PieChart, Activity, Clock, MapPin, Smartphone, Monitor, Tablet, LogOut, Settings, Bell, AlertTriangle, CheckCircle, XCircle, Mail, MessageCircle, Database, FileText, DatabaseBackup as Backup, Wifi, HardDrive, Cpu, MemoryStick, Network, Gauge, LineChart, Send, Archive, History, UserCheck, Briefcase, Target, Layers, Code, Terminal, Cloud, Lock, Key, Fingerprint } from 'lucide-react';
import { superDatabase } from '../utils/database';
import type { User, Order, SpecialOffer, Coupon } from '../utils/database';

interface AdminPageProps {
  theme?: string;
  onLogout?: () => void;
}

// Email notification system
class EmailNotificationService {
  static async sendOrderConfirmation(order: Order, user: User) {
    // Simulate email sending
    console.log(`📧 Email sent to ${user.email}: Order ${order.orderId} confirmed`);
    return true;
  }

  static async sendWelcomeEmail(user: User) {
    console.log(`📧 Welcome email sent to ${user.email}`);
    return true;
  }

  static async sendPromotionalEmail(users: User[], offer: SpecialOffer) {
    console.log(`📧 Promotional email sent to ${users.length} users about ${offer.planName}`);
    return true;
  }
}

// Revenue analytics
class RevenueAnalytics {
  static calculateRevenue(orders: Order[]) {
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    const totalRevenue = confirmedOrders.reduce((sum, order) => {
      const price = parseInt(order.price.replace(/[₹,]/g, '').split('/')[0]);
      return sum + price;
    }, 0);

    const monthlyRevenue = confirmedOrders
      .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, order) => {
        const price = parseInt(order.price.replace(/[₹,]/g, '').split('/')[0]);
        return sum + price;
      }, 0);

    return { totalRevenue, monthlyRevenue, confirmedOrders: confirmedOrders.length };
  }

  static getRevenueByType(orders: Order[]) {
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    const revenueByType = confirmedOrders.reduce((acc, order) => {
      const price = parseInt(order.price.replace(/[₹,]/g, '').split('/')[0]);
      acc[order.type] = (acc[order.type] || 0) + price;
      return acc;
    }, {} as Record<string, number>);

    return revenueByType;
  }
}

// Performance monitoring
class PerformanceMonitor {
  static getSystemMetrics() {
    return {
      responseTime: Math.random() * 100 + 50, // Simulated
      uptime: 99.9,
      activeConnections: Math.floor(Math.random() * 1000) + 500,
      memoryUsage: Math.random() * 80 + 10,
      cpuUsage: Math.random() * 60 + 20,
      diskUsage: Math.random() * 70 + 15
    };
  }
}

// Audit logging
class AuditLogger {
  private static logs: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
    details: any;
  }> = [];

  static log(action: string, user: string, details: any = {}) {
    const logEntry = {
      id: Date.now().toString(),
      action,
      user,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.logs.unshift(logEntry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
    
    console.log(`🔍 Audit Log: ${action} by ${user}`, details);
  }

  static getLogs() {
    return this.logs;
  }
}

const AdminPage: React.FC<AdminPageProps> = ({ theme = 'dark', onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [revenueData, setRevenueData] = useState<any>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // New offer form state
  const [newOffer, setNewOffer] = useState({
    type: 'minecraft' as 'minecraft' | 'vps' | 'domain',
    planName: '',
    originalPrice: '',
    discountPrice: '',
    discountPercentage: 0,
    isActive: true
  });

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    usageLimit: 1,
    expiryDate: '',
    isActive: true
  });

  // Email campaign state
  const [emailCampaign, setEmailCampaign] = useState({
    subject: '',
    message: '',
    targetAudience: 'all' as 'all' | 'premium' | 'normal'
  });

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
          dangerButton: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
          successButton: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
          warningButton: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
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
          dangerButton: 'bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600/80 hover:to-pink-600/80',
          successButton: 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80',
          warningButton: 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-600/80 hover:to-orange-600/80',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          dangerButton: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
          successButton: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
          warningButton: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
          input: 'bg-white/10 border-white/20 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  // Load data on component mount and set up auto-refresh
  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
      updatePerformanceMetrics();
    }, 30000);

    // Initial performance metrics
    updatePerformanceMetrics();

    return () => clearInterval(interval);
  }, []);

  const updatePerformanceMetrics = () => {
    setPerformanceMetrics(PerformanceMonitor.getSystemMetrics());
  };

  const loadData = () => {
    setIsLoading(true);
    try {
      // Force sync with other devices first
      superDatabase.forceSync();
      
      // Load all data
      const allUsers = superDatabase.getAllUsers();
      const allOrders = superDatabase.getAllOrders();
      const allOffers = superDatabase.getAllSpecialOffers();
      const allCoupons = superDatabase.getAllCoupons();
      const analyticsData = superDatabase.getAnalytics();
      // Filter out the default user/data created during initialization if any
      const realUsers = allUsers.filter(user => user.id !== 'default-user-id'); // Adjust 'default-user-id' as per your database initialization

      setUsers(allUsers);
      setOrders(allOrders);
      setSpecialOffers(allOffers);
      setCoupons(allCoupons);
      setAnalytics(analyticsData);
      
      // Calculate revenue data
      const revenue = RevenueAnalytics.calculateRevenue(allOrders);
      const revenueByType = RevenueAnalytics.getRevenueByType(allOrders);
      setRevenueData({ ...revenue, revenueByType });
      
      // Load audit logs
 setAuditLogs(AuditLogger.getLogs().slice(0, 100)); // Limit logs to a reasonable number
      
      // Generate notifications
      generateNotifications(allOrders, allUsers);
      
      setLastRefresh(new Date());
      
      AuditLogger.log('Data Refresh', 'Admin', { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNotifications = (orders: Order[], users: User[]) => {
    const notifications = [];
    
    // Pending orders notification
    const pendingOrders = orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      notifications.push({
        id: 'pending-orders',
        type: 'warning',
        title: 'Pending Orders',
        message: `${pendingOrders.length} orders need attention`,
        action: () => setActiveTab('orders')
      });
    }
    
    // New users notification
    const recentUsers = users.filter(u => 
      new Date(u.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    if (recentUsers.length > 0) {
      notifications.push({
        id: 'new-users',
        type: 'info',
        title: 'New Users',
        message: `${recentUsers.length} new users joined today`,
        action: () => setActiveTab('users')
      });
    }
    
    // Expiring coupons
    const expiringCoupons = coupons.filter(c => 
      new Date(c.expiryDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    if (expiringCoupons.length > 0) {
      notifications.push({
        id: 'expiring-coupons',
        type: 'warning',
        title: 'Expiring Coupons',
        message: `${expiringCoupons.length} coupons expire soon`,
        action: () => setActiveTab('coupons')
      });
    }
    
    setNotifications(notifications);
  };

  const handleRefresh = () => {
    loadData();
    AuditLogger.log('Manual Refresh', 'Admin');
  };

  const handleCreateOffer = () => {
    if (!newOffer.planName || !newOffer.originalPrice || !newOffer.discountPrice) return;

    const discountPercentage = Math.round(
      ((parseInt(newOffer.originalPrice) - parseInt(newOffer.discountPrice)) / parseInt(newOffer.originalPrice)) * 100
    );

    const offer = superDatabase.createSpecialOffer({
      ...newOffer,
      discountPercentage
    });

    setNewOffer({
      type: 'minecraft',
      planName: '',
      originalPrice: '',
      discountPrice: '',
      discountPercentage: 0,
      isActive: true
    });

    AuditLogger.log('Create Special Offer', 'Admin', { offerId: offer.id, planName: offer.planName });
    loadData();
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.expiryDate) return;

    const coupon = superDatabase.createCoupon(newCoupon);

    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      usageLimit: 1,
      expiryDate: '',
      isActive: true
    });

    AuditLogger.log('Create Coupon', 'Admin', { couponId: coupon.id, code: coupon.code });
    loadData();
  };

  const handleDeleteOffer = (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      superDatabase.deleteSpecialOffer(offerId);
      AuditLogger.log('Delete Special Offer', 'Admin', { offerId });
      loadData();
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      superDatabase.deleteCoupon(couponId);
      AuditLogger.log('Delete Coupon', 'Admin', { couponId });
      loadData();
    }
  };

  const handleToggleOffer = (offerId: string) => {
    superDatabase.toggleSpecialOffer(offerId);
    AuditLogger.log('Toggle Special Offer', 'Admin', { offerId });
    loadData();
  };

  const handleToggleCoupon = (couponId: string) => {
    superDatabase.toggleCoupon(couponId);
    AuditLogger.log('Toggle Coupon', 'Admin', { couponId });
    loadData();
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to confirm this order?')) {
      const success = superDatabase.confirmOrder(orderId);
      if (success) {
        const order = orders.find(o => o.orderId === orderId);
        const user = users.find(u => u.id === order?.userId);
        
        if (order && user) {
          await EmailNotificationService.sendOrderConfirmation(order, user);
        }
        
        AuditLogger.log('Confirm Order', 'Admin', { orderId });
        loadData();
      }
    }
  };

  const handleResetOrder = (orderId: string) => {
    if (confirm('Are you sure you want to reset this order to pending?')) {
      superDatabase.resetOrder(orderId);
      AuditLogger.log('Reset Order', 'Admin', { orderId });
      loadData();
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      superDatabase.deleteOrder(orderId);
      AuditLogger.log('Delete Order', 'Admin', { orderId });
      loadData();
    }
  };

  const handleBulkOrderAction = (action: string, orderIds: string[]) => {
    if (confirm(`Are you sure you want to ${action} ${orderIds.length} orders?`)) {
      orderIds.forEach(orderId => {
        switch (action) {
          case 'confirm':
            superDatabase.confirmOrder(orderId);
            break;
          case 'reset':
            superDatabase.resetOrder(orderId);
            break;
          case 'delete':
            superDatabase.deleteOrder(orderId);
            break;
        }
      });
      
      AuditLogger.log('Bulk Order Action', 'Admin', { action, orderIds });
      loadData();
    }
  };

  const handleSendEmailCampaign = async () => {
    if (!emailCampaign.subject || !emailCampaign.message) return;

    let targetUsers = users;
    if (emailCampaign.targetAudience === 'premium') {
      targetUsers = users.filter(u => u.membershipType === 'premium');
    } else if (emailCampaign.targetAudience === 'normal') {
      targetUsers = users.filter(u => u.membershipType === 'normal');
    }

    // Simulate sending emails
    console.log(`📧 Sending email campaign to ${targetUsers.length} users`);
    
    AuditLogger.log('Send Email Campaign', 'Admin', {
      subject: emailCampaign.subject,
      targetAudience: emailCampaign.targetAudience,
      recipientCount: targetUsers.length
    });

    setEmailCampaign({ subject: '', message: '', targetAudience: 'all' });
    alert(`Email campaign sent to ${targetUsers.length} users!`);
  };

  const handleBackupData = () => {
    const backupData = {
      users,
      orders,
      specialOffers,
      coupons,
      analytics,
      auditLogs,
      backupDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demon-node-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    AuditLogger.log('Data Backup', 'Admin', { recordCount: users.length + orders.length });
  };

  const exportData = () => {
    const data = {
      users,
      orders,
      specialOffers,
      coupons,
      analytics,
      revenueData,
      performanceMetrics,
      auditLogs,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demon-node-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    AuditLogger.log('Data Export', 'Admin');
  };

  const generateReport = () => {
    const report = {
      summary: {
        totalUsers: analytics.totalUsers,
        totalOrders: analytics.totalOrders,
        totalRevenue: revenueData.totalRevenue,
        conversionRate: analytics.totalUsers > 0 ? (analytics.confirmedOrders / analytics.totalUsers * 100).toFixed(2) : 0
      },
      revenue: revenueData,
      performance: performanceMetrics,
      userAnalytics: analytics,
      recentActivity: auditLogs.slice(0, 50),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demon-node-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    AuditLogger.log('Generate Report', 'Admin');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Tablet': return <Tablet className="w-4 h-4" />;
      case 'Desktop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'minecraft': return <Shield className="w-4 h-4 text-green-400" />;
      case 'vps': return <Server className="w-4 h-4 text-blue-400" />;
      case 'domain': return <Globe className="w-4 h-4 text-purple-400" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'orders', name: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'offers', name: 'Special Offers', icon: <Gift className="w-4 h-4" /> },
    { id: 'coupons', name: 'Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <PieChart className="w-4 h-4" /> },
    { id: 'revenue', name: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'performance', name: 'Performance', icon: <Gauge className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'audit', name: 'Audit Logs', icon: <History className="w-4 h-4" /> },
    { id: 'support', name: 'Support', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className={`min-h-screen ${themeStyles.bg} font-['Inter',sans-serif]`}>
      {/* Header */}
      <header className={`${themeStyles.card} border-b border-white/10 sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                <img 
                  src="/05b5bc0e84997d92e62826cfce30b63a.webp" 
                  alt="Demon Node Logo" 
                  className="w-full h-full object-cover flex-shrink-0" // Added flex-shrink-0
                />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${themeStyles.text}`}>Demon Node™ Admin</h1>
                <p className={`text-sm ${themeStyles.textMuted}`}>Advanced Control Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications Badge */}
              {notifications.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`${themeStyles.card} p-2 rounded-lg border relative`}
                  >
                    <Bell className="w-4 h-4 text-yellow-400" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </button>
                </div>
              )}

              <div className={`${themeStyles.card} px-2 py-1 sm:px-3 sm:py-2 rounded-lg border flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm`}>
                <Activity className="w-4 h-4 text-green-400" />
                <span className={`text-sm ${themeStyles.textSecondary}`}>
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`${themeStyles.button} text-white p-2 rounded-lg transition-all duration-300 disabled:opacity-50`}
                title="Refresh Data" 
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleBackupData}
                className={`${themeStyles.warningButton} text-white p-2 rounded-lg transition-all duration-300`}
                title="Backup Data"
              >
                <Backup className="w-4 h-4" />
              </button>

              <button
                onClick={exportData}
                className={`${themeStyles.successButton} text-white p-2 rounded-lg transition-all duration-300`}
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    sessionStorage.removeItem('admin_authenticated');
                    window.location.href = '/';
                  }
                }}
                className={`${themeStyles.dangerButton} text-white p-2 rounded-lg transition-all duration-300`}
                title="Logout" 
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className={`${themeStyles.card} p-2 rounded-xl border inline-flex space-x-1 overflow-x-auto max-w-full flex-nowrap`}>
            {tabs.map((tab) => ( 
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? `${themeStyles.button} text-white`
                    : `${themeStyles.textSecondary} hover:text-white hover:bg-white/10`
                }`} 
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Total Users</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{analytics.totalUsers || 0}</p>
                    {/* Display real user counts */}
                    <p className={`text-xs ${themeStyles.textSecondary}`}>
                      {users.filter(u => u.membershipType === 'premium').length} premium • {users.filter(u => u.membershipType === 'normal').length} normal
                    </p>

                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Total Revenue</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>₹{revenueData.totalRevenue || 0}</p>
                    <p className={`text-xs ${themeStyles.textSecondary}`}>
                      ₹{revenueData.monthlyRevenue || 0} this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Orders</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{analytics.totalOrders || 0}</p>
                    <p className={`text-xs ${themeStyles.textSecondary}`}>
                      {analytics.confirmedOrders || 0} confirmed • {analytics.pendingOrders || 0} pending
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>System Health</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{performanceMetrics.uptime || 99.9}%</p>
                    <p className={`text-xs ${themeStyles.textSecondary}`}>
                      {Math.round(performanceMetrics.responseTime || 0)}ms response
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Made responsive) */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.text} mb-4`}>Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${themeStyles.button} text-white p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-1 sm:space-y-2 text-xs sm:text-sm font-medium`}
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Manage Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`${themeStyles.successButton} text-white p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-1 sm:space-y-2 text-xs sm:text-sm font-medium`}
                >
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Create Offer</span>
                </button>
                <button
                  onClick={generateReport}
                  className={`${themeStyles.warningButton} text-white p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-1 sm:space-y-2 text-xs sm:text-sm font-medium`}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Generate Report</span>
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`${themeStyles.dangerButton} text-white p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-1 sm:space-y-2 text-xs sm:text-sm font-medium`}
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Support Chat</span>
                </button>
              </div>
            </div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className={`${themeStyles.card} p-4 rounded-lg border flex items-center justify-between`}>
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(order.type)}
                        <div>
                          <p className={`font-semibold ${themeStyles.text}`}>#{order.orderId}</p>
                          <p className={`text-sm ${themeStyles.textSecondary}`}>{order.planName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${themeStyles.textSecondary}`}>{order.price}</span>
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className={`text-center ${themeStyles.textMuted} py-8`}>No orders yet</p>
                  )}
                </div>
              </div>

              {/* System Performance */}
              <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>System Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className={`text-sm ${themeStyles.textSecondary}`}>CPU Usage</span>
                    </div>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>
                      {Math.round(performanceMetrics.cpuUsage || 0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="w-4 h-4 text-green-400" />
                      <span className={`text-sm ${themeStyles.textSecondary}`}>Memory Usage</span>
                    </div>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>
                      {Math.round(performanceMetrics.memoryUsage || 0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span className={`text-sm ${themeStyles.textSecondary}`}>Disk Usage</span>
                    </div>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>
                      {Math.round(performanceMetrics.diskUsage || 0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Network className="w-4 h-4 text-yellow-400" />
                      <span className={`text-sm ${themeStyles.textSecondary}`}>Active Connections</span>
                    </div>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>
                      {performanceMetrics.activeConnections || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Total Revenue</p>
                    <p className={`text-3xl font-bold ${themeStyles.text}`}>₹{revenueData.totalRevenue || 0}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Monthly Revenue</p>
                    <p className={`text-3xl font-bold ${themeStyles.text}`}>₹{revenueData.monthlyRevenue || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className={`${themeStyles.card} p-4 sm:p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Avg. Order Value</p>
                    <p className={`text-3xl font-bold ${themeStyles.text}`}>
                      ₹{revenueData.confirmedOrders > 0 ? Math.round(revenueData.totalRevenue / revenueData.confirmedOrders) : 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Revenue by Service Type */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>Revenue by Service Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(revenueData.revenueByType || {}).map(([type, revenue]) => (
                  <div key={type} className={`${themeStyles.card} p-4 rounded-lg border text-center`}>
                    <div className="flex justify-center mb-3">
                      {getTypeIcon(type)}
                    </div>
                    <h4 className={`font-semibold ${themeStyles.text} capitalize mb-2`}>{type}</h4>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>₹{revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Uptime</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{performanceMetrics.uptime}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Response Time</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{Math.round(performanceMetrics.responseTime)}ms</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Active Users</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{performanceMetrics.activeConnections}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>System Load</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>{Math.round(performanceMetrics.cpuUsage)}%</p>
                  </div>
                  <Gauge className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Detailed Performance */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>System Resources</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${themeStyles.textSecondary}`}>CPU Usage</span>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>{Math.round(performanceMetrics.cpuUsage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${performanceMetrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${themeStyles.textSecondary}`}>Memory Usage</span>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>{Math.round(performanceMetrics.memoryUsage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${performanceMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${themeStyles.textSecondary}`}>Disk Usage</span>
                    <span className={`text-sm font-bold ${themeStyles.text}`}>{Math.round(performanceMetrics.diskUsage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${performanceMetrics.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-8">
            {/* Email Campaign */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Send Email Campaign</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Email Subject"
                    value={emailCampaign.subject}
                    onChange={(e) => setEmailCampaign({...emailCampaign, subject: e.target.value})}
                    className={`px-4 py-2 ${themeStyles.input} border rounded-lg`}
                  />
                  <select
                    value={emailCampaign.targetAudience}
                    onChange={(e) => setEmailCampaign({...emailCampaign, targetAudience: e.target.value as any})}
                    className={`px-4 py-2 ${themeStyles.input} border rounded-lg`}
                  >
                    <option value="all">All Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="normal">Normal Users</option>
                  </select>
                </div>
                <textarea
                  placeholder="Email Message"
                  value={emailCampaign.message}
                  onChange={(e) => setEmailCampaign({...emailCampaign, message: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <button
                  onClick={handleSendEmailCampaign}
                  className={`${themeStyles.button} text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Campaign</span>
                </button>
              </div>
            </div>

            {/* System Notifications */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>System Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`${themeStyles.card} p-4 rounded-lg border flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className={`font-semibold ${themeStyles.text}`}>{notification.title}</p>
                        <p className={`text-sm ${themeStyles.textSecondary}`}>{notification.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={notification.action}
                      className={`${themeStyles.button} text-white px-4 py-2 rounded-lg text-sm`}
                    >
                      View
                    </button>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className={`text-center ${themeStyles.textMuted} py-8`}>No notifications</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className={`${themeStyles.card} rounded-xl border overflow-hidden`}>
              <div className="p-4 sm:p-6 border-b border-white/10">
                <h3 className={`text-xl font-bold ${themeStyles.text}`}>Audit Logs</h3>
                <p className={`text-sm ${themeStyles.textMuted}`}>Track all administrative actions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${themeStyles.card} border-b border-white/10`}>
                    <tr>
                      <th className={`text-left p-2 sm:p-4 font-semibold ${themeStyles.text} text-sm sm:text-base`}>Timestamp</th>
                      <th className={`text-left p-2 sm:p-4 font-semibold ${themeStyles.text} text-sm sm:text-base`}>Action</th>
                      <th className={`text-left p-2 sm:p-4 font-semibold ${themeStyles.text} text-sm sm:text-base`}>User</th>
                      <th className={`text-left p-2 sm:p-4 font-semibold ${themeStyles.text} text-sm sm:text-base`}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className={`p-2 sm:p-4 ${themeStyles.textSecondary} text-xs sm:text-sm font-mono`}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className={`p-4 ${themeStyles.text}`}>{log.action}</td>
                        <td className={`p-4 ${themeStyles.textSecondary}`}>{log.user}</td>
                        <td className={`p-4 ${themeStyles.textMuted} text-sm`}>
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {auditLogs.length === 0 && (
                  <div className="text-center py-8">
                    <p className={`${themeStyles.textMuted}`}>No audit logs found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-8">
            <div className={`${themeStyles.card} rounded-xl p-6 border text-center`}>
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Customer Support Chat</h3>
              <p className={`${themeStyles.textSecondary} mb-6`}>
                Integrated support system coming soon. For now, manage support through Discord.
              </p>
              <a
                href="https://discord.gg/Qy6tuNJmwJ"
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeStyles.button} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center space-x-2`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open Discord</span>
              </a>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className={`${themeStyles.card} rounded-xl p-6 border`}>
              <h3 className={`text-lg sm:text-xl font-bold ${themeStyles.text} mb-6`}>System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${themeStyles.card} p-4 rounded-lg border`}>
                  <h4 className={`font-semibold ${themeStyles.text} mb-2`}>Auto-refresh Interval</h4>
                  <p className={`text-sm ${themeStyles.textMuted} mb-3`}>Currently: 30 seconds</p>
                  <button className={`${themeStyles.button} text-white px-4 py-2 rounded-lg text-sm`}>
                    Configure
                  </button>
                </div>
                <div className={`${themeStyles.card} p-4 rounded-lg border`}>
                  <h4 className={`font-semibold ${themeStyles.text} mb-2`}>Backup Schedule</h4>
                  <p className={`text-sm ${themeStyles.textMuted} mb-3`}>Manual backups only</p>
                  <button className={`${themeStyles.successButton} text-white px-4 py-2 rounded-lg text-sm`}>
                    Enable Auto-backup
                  </button>
                </div>
                <div className={`${themeStyles.card} p-4 rounded-lg border`}>
                  <h4 className={`font-semibold ${themeStyles.text} mb-2`}>Security Settings</h4>
                  <p className={`text-sm ${themeStyles.textMuted} mb-3`}>Two-factor authentication</p>
                  <button className={`${themeStyles.warningButton} text-white px-4 py-2 rounded-lg text-sm`}>
                    Configure 2FA
                  </button>
                </div>
                <div className={`${themeStyles.card} p-4 rounded-lg border`}>
                  <h4 className={`font-semibold ${themeStyles.text} mb-2`}>API Access</h4>
                  <p className={`text-sm ${themeStyles.textMuted} mb-3`}>Manage API keys</p>
                  <button className={`${themeStyles.dangerButton} text-white px-4 py-2 rounded-lg text-sm`}>
                    Manage Keys
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Include all other existing tabs (orders, users, offers, coupons, analytics) with the same content as before */}
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Orders List */}
            <div className={`${themeStyles.card} rounded-xl border overflow-x-auto`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${themeStyles.card} border-b border-white/10`}>
                    <tr>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Order ID</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Type</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Plan</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Customer</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Price</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Status</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Date</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 text-sm">
                        <td className={`p-4 ${themeStyles.text} font-mono text-sm`}>#{order.orderId}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(order.type)}
                            <span className={`${themeStyles.textSecondary} capitalize`}>{order.type}</span>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.text}`}>{order.planName}</td>
                        <td className={`p-4 ${themeStyles.textSecondary}`}>
                          <div>
                            <div>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</div>
                            <div className="text-xs opacity-75">{order.customerInfo?.email}</div>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.text} font-semibold`}>{order.price}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-sm capitalize ${
                              order.status === 'confirmed' ? 'text-green-400' :
                              order.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.textSecondary} text-sm`}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleConfirmOrder(order.orderId)}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                                title="Confirm Order"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => handleResetOrder(order.orderId)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded transition-colors"
                                title="Reset to Pending"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order.orderId)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className={`${themeStyles.textMuted}`}>No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className={`${themeStyles.card} rounded-xl border overflow-hidden`}>
              <div className="overflow-x-auto"> 
                <table className="w-full">
                  <thead className={`${themeStyles.card} border-b border-white/10`}>
                    <tr>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>User</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Email</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Membership</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Purchases</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Device</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 text-sm">
                        <td className={`p-4 ${themeStyles.text}`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">{user.username}</div>
                              <div className="text-xs opacity-75">ID: {user.discordId}</div>
                            </div>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.textSecondary}`}>{user.email}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {user.membershipType === 'premium' ? (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <Users className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-sm capitalize ${
                              user.membershipType === 'premium' ? 'text-yellow-400' : themeStyles.textSecondary
                            }`}>
                              {user.membershipType}
                            </span>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.text}`}>{user.purchases.length}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(user.deviceInfo || 'Unknown')}
                            <span className={`text-sm ${themeStyles.textSecondary}`}>
                              {user.deviceInfo || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className={`p-4 ${themeStyles.textSecondary} text-sm`}>
                          {new Date(user.lastSeen).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-8">
                    <p className={`${themeStyles.textMuted}`}>No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Special Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            {/* Create New Offer */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Create Special Offer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                  value={newOffer.type}
                  onChange={(e) => setNewOffer({...newOffer, type: e.target.value as any})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                >
                  <option value="minecraft">Minecraft</option>
                  <option value="vps">VPS</option>
                  <option value="domain">Domain</option>
                </select>
                <input
                  type="text"
                  placeholder="Plan Name"
                  value={newOffer.planName}
                  onChange={(e) => setNewOffer({...newOffer, planName: e.target.value})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <input
                  type="text"
                  placeholder="Original Price (₹)"
                  value={newOffer.originalPrice}
                  onChange={(e) => setNewOffer({...newOffer, originalPrice: e.target.value})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <input
                  type="text"
                  placeholder="Discount Price (₹)"
                  value={newOffer.discountPrice}
                  onChange={(e) => setNewOffer({...newOffer, discountPrice: e.target.value})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <button
                  onClick={handleCreateOffer}
                  className={`${themeStyles.successButton} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  <Plus className="w-4 h-4 mr-0 sm:mr-2" />
                  Create
                </button>
              </div>
            </div>

            {/* Offers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialOffers.map((offer) => ( 
                <div key={offer.id} className={`${themeStyles.card} rounded-xl p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(offer.type)}
                      <span className={`font-semibold ${themeStyles.text} capitalize`}>{offer.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleOffer(offer.id)}
                        className={`p-1 rounded transition-colors ${
                          offer.isActive ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={offer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {offer.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className={`text-lg font-bold ${themeStyles.text} mb-2`}>{offer.planName}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Original:</span>
                      <span className={`${themeStyles.textMuted} line-through`}>{offer.originalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Discounted:</span>
                      <span className="text-green-400 font-bold">{offer.discountPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Discount:</span>
                      <span className="text-purple-400 font-bold">{offer.discountPercentage}% OFF</span>
                    </div>
                  </div>
                  <div className={`mt-4 text-xs ${themeStyles.textMuted}`}>
                    Created: {new Date(offer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {specialOffers.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className={`${themeStyles.textMuted}`}>No special offers created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Create New Coupon */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Create Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg font-mono`}
                />
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseInt(e.target.value) || 0})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <input
                  type="number"
                  placeholder="Usage Limit"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({...newCoupon, usageLimit: parseInt(e.target.value) || 1})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  className={`px-3 py-2 ${themeStyles.input} border rounded-lg`}
                />
                <button
                  onClick={handleCreateCoupon}
                  className={`${themeStyles.successButton} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  <Plus className="w-4 h-4 mr-0 sm:mr-2" />
                  Create
                </button>
              </div>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => ( 
                <div key={coupon.id} className={`${themeStyles.card} rounded-xl p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span className={`font-mono font-bold ${themeStyles.text}`}>{coupon.code}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleCoupon(coupon.id)}
                        className={`p-1 rounded transition-colors ${
                          coupon.isActive ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {coupon.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Discount:</span>
                      <span className="text-green-400 font-bold">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Usage:</span>
                      <span className={`${themeStyles.text}`}>{coupon.usedCount}/{coupon.usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeStyles.textSecondary}`}>Expires:</span>
                      <span className={`${themeStyles.text} text-sm`}>
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`mt-4 text-xs ${themeStyles.textMuted}`}>
                    Created: {new Date(coupon.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className={`${themeStyles.textMuted}`}>No coupons created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Conversion Rate</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>
                      {analytics.totalUsers > 0 ? Math.round((analytics.confirmedOrders / analytics.totalUsers) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Premium Users</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>
                      {analytics.totalUsers > 0 ? Math.round((analytics.premiumUsers / analytics.totalUsers) * 100) : 0}%
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Order Success Rate</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>
                      {analytics.totalOrders > 0 ? Math.round((analytics.confirmedOrders / analytics.totalOrders) * 100) : 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-xl border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${themeStyles.textMuted}`}>Active Promotions</p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>
                      {(analytics.activeOffers || 0) + (analytics.activeCoupons || 0)}
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Order Types Distribution */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>Order Distribution by Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['minecraft', 'vps', 'domain'].map((type) => {
                  const typeOrders = orders.filter(order => order.type === type);
                  const percentage = orders.length > 0 ? Math.round((typeOrders.length / orders.length) * 100) : 0;
                  
                  return (
                    <div key={type} className={`${themeStyles.card} p-4 rounded-lg border text-center`}>
                      <div className="flex justify-center mb-3">
                        {getTypeIcon(type)}
                      </div>
                      <h4 className={`font-semibold ${themeStyles.text} capitalize mb-2`}>{type}</h4>
                      <p className={`text-2xl font-bold ${themeStyles.text} mb-1`}>{typeOrders.length}</p>
                      <p className={`text-sm ${themeStyles.textMuted}`}>{percentage}% of total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${themeStyles.card} rounded-xl p-4 sm:p-6 border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>Recent Activity</h3>
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(order.type)}
                      <div>
                        <p className={`font-medium ${themeStyles.text}`}>
                          New {order.type} order: {order.planName}
                        </p>
                        <p className={`text-sm ${themeStyles.textMuted}`}>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${themeStyles.textSecondary}`}>{order.price}</span>
                      {getStatusIcon(order.status)}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className={`text-center ${themeStyles.textMuted} py-8`}>No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
