import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Server, 
  Shield, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Gamepad2, 
  Search,
  Plus,
  Minus,
  MapPin,
  Clock,
  Award,
  Headphones,
  TrendingUp,
  Heart,
  Play,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import DomainOrderForm from './components/DomainOrderForm';
import ThemeToggle from './components/ThemeToggle';
import HostingPlans from './components/HostingPlans';
import DomainTLDList from './components/DomainTLDList';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({ units: 0, backups: 0 });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [selectedPlatform, setSelectedPlatform] = useState('minecraft');
  const [isScrolled, setIsScrolled] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const themeClasses = {
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      cardBg: 'bg-white/10 backdrop-blur-md',
      border: 'border-white/20',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      navBg: 'bg-black/20 backdrop-blur-xl'
    },
    light: {
      bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      cardBg: 'bg-white/80 backdrop-blur-md',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-600',
      navBg: 'bg-white/20 backdrop-blur-xl'
    }
  };

  const currentTheme = themeClasses[theme as keyof typeof themeClasses];

  const platforms = [
    {
      id: 'minecraft',
      name: 'Minecraft',
      icon: <Gamepad2 className="w-6 h-6" />,
      description: 'Java & Bedrock Edition',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'discord',
      name: 'Discord Bots',
      icon: <Monitor className="w-6 h-6" />,
      description: 'Node.js & Python',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'web',
      name: 'Web Hosting',
      icon: <Globe className="w-6 h-6" />,
      description: 'Static & Dynamic Sites',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'vps',
      name: 'VPS Hosting',
      icon: <Server className="w-6 h-6" />,
      description: 'Full Root Access',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const domainExtensions = [
    { tld: '.com', price: '₹999' },
    { tld: '.in', price: '₹599' },
    { tld: '.org', price: '₹899' },
    { tld: '.net', price: '₹1099' },
    { tld: '.co', price: '₹1299' },
    { tld: '.io', price: '₹2999' }
  ];

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setCurrentView('payment');
  };

  const handleDomainSearch = () => {
    if (!domainSearch.trim()) return;
    
    const results = domainExtensions.map(ext => ({
      domain: domainSearch.toLowerCase().replace(/\s+/g, ''),
      tld: ext.tld,
      price: ext.price,
      available: Math.random() > 0.3
    }));
    
    setSearchResults(results);
  };

  const handleDomainSelect = (domain: any) => {
    setSelectedDomain(domain);
    setCurrentView('domainOrder');
  };

  if (currentView === 'payment') {
    return <PaymentForm 
      selectedPlan={selectedPlan} 
      selectedAddons={selectedAddons}
      onBack={() => setCurrentView('home')} 
      theme={theme}
    />;
  }

  if (currentView === 'domainOrder') {
    return <DomainOrderForm 
      selectedDomain={selectedDomain}
      onBack={() => setCurrentView('home')} 
      theme={theme}
    />;
  }

  if (currentView === 'hosting') {
    return <HostingPlans 
      onBack={() => setCurrentView('home')}
      onPlanSelect={handlePlanSelect}
      theme={theme}
    />;
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? `${currentTheme.navBg} border-b ${currentTheme.border}` : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className={`text-2xl font-bold ${currentTheme.text}`}>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CraftDomains
                </span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#home" className={`${currentTheme.textSecondary} hover:text-purple-400 transition-colors`}>Home</a>
                <a href="#hosting" className={`${currentTheme.textSecondary} hover:text-purple-400 transition-colors`}>Hosting</a>
                <a href="#domains" className={`${currentTheme.textSecondary} hover:text-purple-400 transition-colors`}>Domains</a>
                <a href="#tlds" className={`${currentTheme.textSecondary} hover:text-purple-400 transition-colors`}>Extensions</a>
                <a href="#about" className={`${currentTheme.textSecondary} hover:text-purple-400 transition-colors`}>About</a>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-8 animate-fade-in-up">
              <Star className="w-4 h-4 text-purple-400 mr-2" />
              <span className={`text-sm ${currentTheme.textSecondary}`}>Trusted by 10,000+ Indian Gamers</span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold ${currentTheme.text} mb-6 animate-fade-in-up`}>
              <span className="block">Premium</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Gaming Infrastructure
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl ${currentTheme.textSecondary} mb-12 max-w-4xl mx-auto animate-fade-in-up leading-relaxed`}>
              Experience lightning-fast hosting with enterprise-grade infrastructure designed specifically for Indian gamers. 
              From Minecraft servers to Discord bots, we've got you covered.
            </p>

            {/* Platform Selection */}
            <div className="mb-12 animate-fade-in-up">
              <h3 className={`text-lg font-semibold ${currentTheme.text} mb-6`}>Choose Your Platform</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                      selectedPlatform === platform.id
                        ? `${currentTheme.cardBg} ${currentTheme.border} ring-2 ring-purple-500`
                        : `${currentTheme.cardBg} ${currentTheme.border} hover:border-purple-500/50`
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {platform.icon}
                      </div>
                    </div>
                    <h4 className={`font-semibold ${currentTheme.text} mb-2`}>{platform.name}</h4>
                    <p className={`text-sm ${currentTheme.textMuted}`}>{platform.description}</p>
                    
                    {selectedPlatform === platform.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
              <button 
                onClick={() => setCurrentView('hosting')}
                className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Your Server
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })}
                className={`group ${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.text} px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-lg`}
              >
                <Globe className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Your Domain
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <ChevronDown className={`w-6 h-6 ${currentTheme.textMuted} mx-auto`} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-6`}>
              Why Choose CraftDomains?
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}>
              Built specifically for the Indian gaming community with cutting-edge technology and unmatched performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Mumbai Servers',
                description: 'Ultra-low latency with premium data centers located in Mumbai for the best gaming experience',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'DDoS Protection',
                description: 'Enterprise-grade protection with 99.9% attack mitigation to keep your server online 24/7',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Setup',
                description: 'Get your server running in under 60 seconds with our automated deployment system',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: '24/7 Expert Support',
                description: 'Dedicated gaming experts available round the clock via Discord, email, and live chat',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <div key={index} className={`group ${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${currentTheme.text} mb-4 group-hover:text-purple-400 transition-colors`}>{feature.title}</h3>
                <p className={`${currentTheme.textMuted} leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, number: '10,000+', label: 'Happy Gamers', color: 'from-blue-500 to-cyan-500' },
              { icon: <Server className="w-8 h-8" />, number: '5,000+', label: 'Servers Hosted', color: 'from-green-500 to-emerald-500' },
              { icon: <TrendingUp className="w-8 h-8" />, number: '99.9%', label: 'Uptime SLA', color: 'from-yellow-500 to-orange-500' },
              { icon: <Heart className="w-8 h-8" />, number: '24/7', label: 'Expert Support', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 group`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-2 group-hover:text-purple-400 transition-colors`}>{stat.number}</div>
                <div className={`${currentTheme.textMuted} font-medium`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Registration Section */}
      <section id="domains" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-6`}>
              Secure Your Perfect Domain
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}>
              Get your ideal domain name with competitive pricing, free privacy protection, and instant activation
            </p>
          </div>

          <div className={`max-w-3xl mx-auto ${currentTheme.cardBg} ${currentTheme.border} border rounded-3xl p-8 mb-12 shadow-2xl`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted} w-6 h-6`} />
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder="Enter your dream domain name"
                  className={`w-full pl-14 pr-4 py-4 ${currentTheme.cardBg} ${currentTheme.border} border rounded-xl ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg`}
                  onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                />
              </div>
              <button
                onClick={handleDomainSearch}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-purple-500/25"
              >
                <Search className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                Search Domains
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className={`max-w-5xl mx-auto ${currentTheme.cardBg} ${currentTheme.border} border rounded-3xl p-8 shadow-2xl`}>
              <h3 className={`text-2xl font-bold ${currentTheme.text} mb-8`}>Available Domains</h3>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className={`flex items-center justify-between p-6 ${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl hover:scale-105 transition-all duration-300 group`}>
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 rounded-xl ${result.available ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center`}>
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className={`text-xl font-bold ${currentTheme.text} group-hover:text-purple-400 transition-colors`}>
                          {result.domain}{result.tld}
                        </span>
                        <p className={`text-sm ${result.available ? 'text-green-500' : 'text-red-500'} font-medium`}>
                          {result.available ? '✓ Available' : '✗ Taken'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${currentTheme.text}`}>{result.price}</div>
                        <div className={`text-sm ${currentTheme.textMuted}`}>/year</div>
                      </div>
                      {result.available && (
                        <button
                          onClick={() => handleDomainSelect(result)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
            {domainExtensions.map((ext, index) => (
              <div key={index} className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 group hover:shadow-lg`}>
                <div className={`text-2xl font-bold ${currentTheme.text} mb-2 group-hover:text-purple-400 transition-colors`}>{ext.tld}</div>
                <div className={`text-lg font-semibold ${currentTheme.textSecondary}`}>{ext.price}</div>
                <div className={`text-sm ${currentTheme.textMuted}`}>/year</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain TLD List Section */}
      <section id="tlds">
        <DomainTLDList theme={theme} />
      </section>

      {/* Footer */}
      <footer className={`${currentTheme.cardBg} ${currentTheme.border} border-t py-16 relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CraftDomains
                </span>
              </h3>
              <p className={`${currentTheme.textMuted} mb-6 max-w-md leading-relaxed`}>
                Premium domain registration and gaming infrastructure designed specifically for Indian gamers. 
                Experience the difference with enterprise-grade hosting.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">D</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">T</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">I</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className={`text-lg font-bold ${currentTheme.text} mb-6`}>Services</h4>
              <ul className={`space-y-3 ${currentTheme.textMuted}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Minecraft Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Discord Bot Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Domain Registration</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">VPS Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">DDoS Protection</li>
              </ul>
            </div>
            <div>
              <h4 className={`text-lg font-bold ${currentTheme.text} mb-6`}>Support</h4>
              <ul className={`space-y-3 ${currentTheme.textMuted}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">24/7 Live Chat</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Discord Community</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Knowledge Base</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Server Status</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${currentTheme.border} pt-8 flex flex-col md:flex-row justify-between items-center`}>
            <p className={`${currentTheme.textMuted} text-center md:text-left`}>
              &copy; 2024 CraftDomains. All rights reserved. Made with ❤️ for Indian gamers.
            </p>
            <div className={`flex space-x-6 mt-4 md:mt-0 ${currentTheme.textMuted}`}>
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-purple-400 transition-colors cursor-pointer">Refund Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;