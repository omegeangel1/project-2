import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Server, 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Search, 
  Gamepad2, 
  Cpu, 
  HardDrive, 
  MapPin, 
  Plus, 
  Minus,
  Moon,
  Sun,
  Palette,
  Award,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import DomainOrderForm from './components/DomainOrderForm';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({ units: 0, backups: 0 });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const minecraftPlans = {
    budget: [
      {
        name: 'Budget Starter',
        planType: 'Budget Plan',
        price: '₹99',
        ram: '1 GB',
        cpu: '1 Core',
        storage: '10 GB SSD',
        location: 'Mumbai, India',
        features: ['DDoS Protection', 'Free Subdomain', '24/7 Support', 'Automatic Backups'],
        addons: {
          unit: '₹30',
          backup: '₹20'
        }
      },
      {
        name: 'Budget Pro',
        planType: 'Budget Plan',
        price: '₹199',
        ram: '2 GB',
        cpu: '2 Cores',
        storage: '20 GB SSD',
        location: 'Mumbai, India',
        features: ['DDoS Protection', 'Free Subdomain', '24/7 Support', 'Automatic Backups', 'Plugin Support'],
        addons: {
          unit: '₹30',
          backup: '₹20'
        }
      },
      {
        name: 'Budget Max',
        planType: 'Budget Plan',
        price: '₹299',
        ram: '3 GB',
        cpu: '3 Cores',
        storage: '30 GB SSD',
        location: 'Mumbai, India',
        features: ['DDoS Protection', 'Free Subdomain', '24/7 Support', 'Automatic Backups', 'Plugin Support', 'Mod Support'],
        addons: {
          unit: '₹30',
          backup: '₹20'
        }
      }
    ],
    powered: [
      {
        name: 'Powered Starter',
        planType: 'Powered Plan',
        price: '₹499',
        ram: '4 GB',
        cpu: '4 Cores',
        storage: '40 GB NVMe',
        location: 'Mumbai, India',
        features: ['Advanced DDoS Protection', 'Free Custom Domain', 'Priority Support', 'Daily Backups', 'Full Plugin Support', 'Mod Support'],
        addons: {
          unit: '₹50',
          backup: '₹30'
        }
      },
      {
        name: 'Powered Pro',
        planType: 'Powered Plan',
        price: '₹799',
        ram: '6 GB',
        cpu: '6 Cores',
        storage: '60 GB NVMe',
        location: 'Mumbai, India',
        features: ['Advanced DDoS Protection', 'Free Custom Domain', 'Priority Support', 'Daily Backups', 'Full Plugin Support', 'Mod Support', 'Database Access'],
        addons: {
          unit: '₹50',
          backup: '₹30'
        }
      },
      {
        name: 'Powered Max',
        planType: 'Powered Plan',
        price: '₹1199',
        ram: '8 GB',
        cpu: '8 Cores',
        storage: '80 GB NVMe',
        location: 'Mumbai, India',
        features: ['Advanced DDoS Protection', 'Free Custom Domain', 'Priority Support', 'Daily Backups', 'Full Plugin Support', 'Mod Support', 'Database Access', 'FTP Access'],
        addons: {
          unit: '₹50',
          backup: '₹30'
        }
      }
    ],
    premium: [
      {
        name: 'Premium Starter',
        planType: 'Premium Plan',
        price: '₹1999',
        ram: '12 GB',
        cpu: '12 Cores',
        storage: '120 GB NVMe',
        location: 'Mumbai, India',
        features: ['Enterprise DDoS Protection', 'Free Custom Domain', 'VIP Support', 'Hourly Backups', 'Full Plugin Support', 'Mod Support', 'Database Access', 'FTP Access', 'Dedicated IP'],
        addons: {
          unit: '₹129',
          backup: '₹50'
        }
      },
      {
        name: 'Premium Pro',
        planType: 'Premium Plan',
        price: '₹2999',
        ram: '16 GB',
        cpu: '16 Cores',
        storage: '160 GB NVMe',
        location: 'Mumbai, India',
        features: ['Enterprise DDoS Protection', 'Free Custom Domain', 'VIP Support', 'Hourly Backups', 'Full Plugin Support', 'Mod Support', 'Database Access', 'FTP Access', 'Dedicated IP', 'Custom JAR'],
        addons: {
          unit: '₹129',
          backup: '₹50'
        }
      },
      {
        name: 'Premium Max',
        planType: 'Premium Plan',
        price: '₹4999',
        ram: '32 GB',
        cpu: '32 Cores',
        storage: '320 GB NVMe',
        location: 'Mumbai, India',
        features: ['Enterprise DDoS Protection', 'Free Custom Domain', 'VIP Support', 'Hourly Backups', 'Full Plugin Support', 'Mod Support', 'Database Access', 'FTP Access', 'Dedicated IP', 'Custom JAR', 'White-label'],
        addons: {
          unit: '₹129',
          backup: '₹50'
        }
      }
    ]
  };

  const domainExtensions = [
    { tld: '.com', price: '₹999' },
    { tld: '.in', price: '₹599' },
    { tld: '.org', price: '₹899' },
    { tld: '.net', price: '₹1099' },
    { tld: '.co', price: '₹1299' },
    { tld: '.io', price: '₹2999' },
    { tld: '.dev', price: '₹1999' },
    { tld: '.app', price: '₹1599' }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setSelectedAddons({ units: 0, backups: 0 });
    setCurrentView('checkout');
  };

  const handleDomainSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = domainExtensions.map(ext => ({
      domain: searchQuery.toLowerCase().replace(/\s+/g, ''),
      tld: ext.tld,
      price: ext.price,
      available: Math.random() > 0.3
    }));
    
    setSearchResults(results);
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setCurrentView('domain-checkout');
  };

  const handleAddonChange = (type, value) => {
    setSelectedAddons(prev => ({
      ...prev,
      [type]: Math.max(0, value)
    }));
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          glowButton: 'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-600/80 hover:to-rose-600/80',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const ThemeToggle = () => (
    <div className="flex items-center space-x-2">
      <div className={`${themeStyles.card} rounded-xl p-2 flex items-center space-x-1`}>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('glass')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'glass' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (currentView === 'checkout') {
    return <PaymentForm 
      selectedPlan={selectedPlan} 
      selectedAddons={selectedAddons}
      onBack={() => setCurrentView('home')} 
      theme={theme}
    />;
  }

  if (currentView === 'domain-checkout') {
    return <DomainOrderForm 
      selectedDomain={selectedDomain} 
      onBack={() => setCurrentView('home')} 
      theme={theme}
    />;
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} font-['Inter',sans-serif]`}>
      {/* Header */}
      <header className={`${isScrolled ? themeStyles.card : 'bg-transparent'} border-b border-white/10 sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${themeStyles.text}`}>Demon Node™</h1>
                <p className={`text-sm ${themeStyles.textMuted}`}>Premium Hosting Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}>Home</a>
              <a href="#domains" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}>Domains</a>
              <a href="#hosting" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}>Hosting</a>
              <a href="#compare" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}>Compare</a>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8 animate-fade-in-up">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className={`text-sm font-semibold ${themeStyles.text}`}>✨ Premium Services for Indian Gamers</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold ${themeStyles.text} mb-6 leading-tight`}>
            Power Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Digital Dreams
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl ${themeStyles.textSecondary} mb-12 max-w-4xl mx-auto leading-relaxed`}>
            Premium domain registration and blazing-fast Minecraft hosting designed specifically for Indian gamers. 
            Choose your path to digital excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className={`${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center group`}>
              <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Register Domain
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('hosting')?.scrollIntoView({ behavior: 'smooth' })}
              className={`${themeStyles.button} ${themeStyles.glowButton} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center group`}
            >
              <Gamepad2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Start Hosting
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domain Registration Card */}
            <div className={`${themeStyles.card} p-8 rounded-3xl group hover:scale-105 transition-all duration-500 border hover:border-pink-500/30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/25">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-3xl font-bold ${themeStyles.text} mb-4`}>Domain Registration</h3>
                <p className={`${themeStyles.textSecondary} text-lg mb-6 leading-relaxed`}>
                  Secure your perfect domain with instant activation, premium extensions, and competitive pricing starting from ₹299.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>Instant Domain Activation</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>Free DNS Management</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>Domain Privacy Protection</span>
                  </li>
                </ul>
                <button className={`${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center group`}>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Minecraft Hosting Card */}
            <div className={`${themeStyles.card} p-8 rounded-3xl group hover:scale-105 transition-all duration-500 border hover:border-purple-500/30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-3xl font-bold ${themeStyles.text} mb-4`}>Minecraft Hosting</h3>
                <p className={`${themeStyles.textSecondary} text-lg mb-6 leading-relaxed`}>
                  High-performance Minecraft servers with Indian locations, 99.9% uptime, and plans starting from just ₹49/month.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>Indian Server Locations</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>99.9% Uptime Guarantee</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary}`}>
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    <span>24/7 Premium Support</span>
                  </li>
                </ul>
                <button 
                  onClick={() => document.getElementById('hosting')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`${themeStyles.button} ${themeStyles.glowButton} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center group`}
                >
                  Choose Plan
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className={`${themeStyles.card} p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${themeStyles.text} mb-2`}>10K+</div>
              <div className={`text-sm ${themeStyles.textMuted}`}>Happy Customers</div>
            </div>
            <div className={`${themeStyles.card} p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${themeStyles.text} mb-2`}>99.9%</div>
              <div className={`text-sm ${themeStyles.textMuted}`}>Uptime</div>
            </div>
            <div className={`${themeStyles.card} p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${themeStyles.text} mb-2`}>24/7</div>
              <div className={`text-sm ${themeStyles.textMuted}`}>Support</div>
            </div>
            <div className={`${themeStyles.card} p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className={`text-3xl font-bold ${themeStyles.text} mb-2`}>5★</div>
              <div className={`text-sm ${themeStyles.textMuted}`}>Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>What Our Customers Say</h2>
            <p className={`text-xl ${themeStyles.textSecondary}`}>Join thousands of satisfied customers who trust us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-6 text-lg leading-relaxed`}>
                "Demon Node™ has been amazing! My server runs smoothly with zero downtime. Best hosting service I've used."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text}`}>Arjun Sharma</div>
                  <div className={`text-sm ${themeStyles.textMuted}`}>Gaming Community Owner</div>
                </div>
              </div>
            </div>

            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-6 text-lg leading-relaxed`}>
                "Best hosting service in India. Great support and affordable pricing! Highly recommend to all gamers."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">PP</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text}`}>Priya Patel</div>
                  <div className={`text-sm ${themeStyles.textMuted}`}>Content Creator</div>
                </div>
              </div>
            </div>

            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-6 text-lg leading-relaxed`}>
                "Domain registration was instant and the hosting is blazing fast. Perfect for my Minecraft server!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">RK</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text}`}>Rohit Kumar</div>
                  <div className={`text-sm ${themeStyles.textMuted}`}>Server Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${themeStyles.card} p-12 rounded-3xl border hover:border-purple-500/30 transition-all duration-300`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-6`}>Ready to Get Started?</h2>
            <p className={`text-xl ${themeStyles.textSecondary} mb-10 leading-relaxed`}>
              Join thousands of satisfied customers who trust Demon Node™ for their digital needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className={`${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}>
                <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Register Domain
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('hosting')?.scrollIntoView({ behavior: 'smooth' })}
                className={`${themeStyles.button} ${themeStyles.glowButton} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
              >
                <Gamepad2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Start Hosting
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minecraft Hosting Plans */}
      <section id="hosting" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>Minecraft Hosting Plans</h2>
            <p className={`text-xl ${themeStyles.textSecondary}`}>Choose the perfect plan for your Minecraft server</p>
          </div>

          {/* Budget Plans */}
          <div className="mb-16">
            <h3 className={`text-3xl font-bold ${themeStyles.text} mb-8 text-center`}>Budget Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.budget.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-green-500/30`}>
                  <div className="text-center mb-6">
                    <h4 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>{plan.name}</h4>
                    <div className={`text-3xl font-bold ${themeStyles.text} mb-1`}>{plan.price}</div>
                    <div className={`${themeStyles.textSecondary} text-sm`}>per month</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <Cpu className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.ram} RAM • {plan.cpu}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <HardDrive className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.storage}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center ${themeStyles.textSecondary}`}>
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} ${themeStyles.glowButton} text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Powered Plans */}
          <div className="mb-16">
            <h3 className={`text-3xl font-bold ${themeStyles.text} mb-8 text-center`}>Powered Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.powered.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative border hover:border-orange-500/30`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h4 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>{plan.name}</h4>
                    <div className={`text-3xl font-bold ${themeStyles.text} mb-1`}>{plan.price}</div>
                    <div className={`${themeStyles.textSecondary} text-sm`}>per month</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <Cpu className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.ram} RAM • {plan.cpu}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <HardDrive className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.storage}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center ${themeStyles.textSecondary}`}>
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} ${themeStyles.glowButton} text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plans */}
          <div>
            <h3 className={`text-3xl font-bold ${themeStyles.text} mb-8 text-center`}>Premium Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.premium.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative border hover:border-purple-500/30`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h4 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>{plan.name}</h4>
                    <div className={`text-3xl font-bold ${themeStyles.text} mb-1`}>{plan.price}</div>
                    <div className={`${themeStyles.textSecondary} text-sm`}>per month</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <Cpu className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.ram} RAM • {plan.cpu}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <HardDrive className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.storage}</span>
                    </div>
                    <div className={`flex items-center ${themeStyles.textSecondary}`}>
                      <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                      <span>{plan.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center ${themeStyles.textSecondary}`}>
                        <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} ${themeStyles.glowButton} text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Domain Registration */}
      <section id="domains" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>Domain Registration</h2>
            <p className={`text-xl ${themeStyles.textSecondary}`}>Secure your perfect domain name today</p>
          </div>

          <div className={`${themeStyles.card} p-8 rounded-2xl mb-8 border hover:border-pink-500/30 transition-all duration-300`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your domain name"
                  className={`w-full px-6 py-4 ${themeStyles.card} border border-white/20 rounded-xl ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg`}
                  onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                />
              </div>
              <button
                onClick={handleDomainSearch}
                className={`${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group`}
              >
                <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className={`${themeStyles.card} rounded-2xl overflow-hidden border`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Search Results</h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 ${themeStyles.card} rounded-lg border hover:border-purple-500/30 transition-all duration-300`}>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <span className={`font-semibold ${themeStyles.text}`}>
                          {result.domain}{result.tld}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.available 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {result.available ? 'Available' : 'Taken'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold ${themeStyles.text}`}>{result.price}/year</span>
                        {result.available && (
                          <button
                            onClick={() => handleDomainSelect(result)}
                            className={`${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300`}
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {domainExtensions.slice(0, 8).map((ext, index) => (
              <div key={index} className={`${themeStyles.card} p-4 rounded-lg text-center border hover:border-purple-500/30 transition-all duration-300 group hover:scale-105`}>
                <div className={`font-bold ${themeStyles.text} mb-1`}>{ext.tld}</div>
                <div className={`text-sm ${themeStyles.textMuted}`}>{ext.price}/year</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${themeStyles.card} border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${themeStyles.text}`}>Demon Node™</span>
              </div>
              <p className={`${themeStyles.textSecondary} text-sm leading-relaxed`}>
                Premium hosting solutions designed for Indian gamers and businesses.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Services</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Minecraft Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Domain Registration</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">DDoS Protection</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Company</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Connect</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Discord Server</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Support Tickets</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Status Page</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Documentation</li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-white/10 mt-8 pt-8 text-center ${themeStyles.textSecondary} text-sm`}>
            <p>&copy; 2024 Demon Node™. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-400" /> for Indian gamers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;