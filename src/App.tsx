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
  Heart
} from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import DomainOrderForm from './components/DomainOrderForm';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({ units: 0, backups: 0 });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

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
      textMuted: 'text-gray-400'
    },
    light: {
      bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      cardBg: 'bg-white/80 backdrop-blur-md',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-600'
    }
  };

  const currentTheme = themeClasses[theme as keyof typeof themeClasses];

  const plans = [
    {
      name: 'Budget',
      planType: 'Shared Hosting',
      price: '₹99',
      ram: '1GB RAM',
      cpu: '1 vCPU',
      storage: '5GB SSD',
      location: 'Mumbai, India',
      features: ['Basic DDoS Protection', 'Free Subdomain', 'Email Support'],
      addons: {
        unit: '₹20',
        backup: '₹15'
      },
      popular: false
    },
    {
      name: 'Powered',
      planType: 'VPS Hosting',
      price: '₹299',
      ram: '4GB RAM',
      cpu: '2 vCPU',
      storage: '20GB NVMe',
      location: 'Mumbai, India',
      features: ['Advanced DDoS Protection', 'Free Domain', 'Priority Support', 'Auto Backups'],
      addons: {
        unit: '₹50',
        backup: '₹30'
      },
      popular: true
    },
    {
      name: 'Premium',
      planType: 'Dedicated Resources',
      price: '₹599',
      ram: '8GB RAM',
      cpu: '4 vCPU',
      storage: '50GB NVMe',
      location: 'Mumbai, India',
      features: ['Enterprise DDoS Protection', 'Free Domain + SSL', '24/7 Phone Support', 'Daily Backups', 'Custom Plugins'],
      addons: {
        unit: '₹100',
        backup: '₹50'
      },
      popular: false
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

  const handleAddonChange = (type: string, value: number) => {
    setSelectedAddons(prev => ({
      ...prev,
      [type]: Math.max(0, value)
    }));
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

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold ${currentTheme.text} mb-6 animate-fade-in-up`}>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CraftDomains
              </span>
            </h1>
            <p className={`text-xl md:text-2xl ${currentTheme.textSecondary} mb-8 max-w-3xl mx-auto animate-fade-in-up`}>
              Premium domain registration and blazing-fast Minecraft server hosting designed for Indian gamers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <button 
                onClick={() => document.getElementById('hosting')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Start Gaming
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })}
                className={`${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.text} px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center`}
              >
                <Globe className="w-5 h-5 mr-2" />
                Get Domain
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
              Why Choose CraftDomains?
            </h2>
            <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
              Built specifically for the Indian gaming community with local servers and 24/7 support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Mumbai Servers',
                description: 'Ultra-low latency with servers located in Mumbai for the best gaming experience'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'DDoS Protection',
                description: 'Enterprise-grade protection to keep your server online 24/7'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '99.9% Uptime',
                description: 'Guaranteed uptime with automatic failover and monitoring'
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: '24/7 Support',
                description: 'Expert support team available round the clock via Discord and email'
              }
            ].map((feature, index) => (
              <div key={index} className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 group`}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>{feature.title}</h3>
                <p className={currentTheme.textMuted}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minecraft Hosting Section */}
      <section id="hosting" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
              Minecraft Hosting Plans
            </h2>
            <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
              Choose the perfect plan for your Minecraft server. All plans include free setup and migration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8 hover:scale-105 transition-all duration-300 group ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>{plan.name}</h3>
                  <p className={`${currentTheme.textMuted} mb-4`}>{plan.planType}</p>
                  <div className={`text-4xl font-bold ${currentTheme.text} mb-2`}>{plan.price}</div>
                  <p className={currentTheme.textMuted}>/month</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex justify-between ${currentTheme.textSecondary}`}>
                    <span>RAM:</span>
                    <span className="font-semibold">{plan.ram}</span>
                  </div>
                  <div className={`flex justify-between ${currentTheme.textSecondary}`}>
                    <span>CPU:</span>
                    <span className="font-semibold">{plan.cpu}</span>
                  </div>
                  <div className={`flex justify-between ${currentTheme.textSecondary}`}>
                    <span>Storage:</span>
                    <span className="font-semibold">{plan.storage}</span>
                  </div>
                  <div className={`flex justify-between ${currentTheme.textSecondary}`}>
                    <span>Location:</span>
                    <span className="font-semibold">{plan.location}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className={`flex items-center ${currentTheme.textSecondary}`}>
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Add-ons Section */}
                <div className={`border-t ${currentTheme.border} pt-6 mb-8`}>
                  <h4 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Add-ons</h4>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between ${currentTheme.textSecondary}`}>
                      <div>
                        <span className="font-medium">Extra Units</span>
                        <p className="text-sm text-gray-500">{plan.addons.unit}/unit</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddonChange('units', selectedAddons.units - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{selectedAddons.units}</span>
                        <button
                          onClick={() => handleAddonChange('units', selectedAddons.units + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between ${currentTheme.textSecondary}`}>
                      <div>
                        <span className="font-medium">Backup Slots</span>
                        <p className="text-sm text-gray-500">{plan.addons.backup}/slot</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddonChange('backups', selectedAddons.backups - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{selectedAddons.backups}</span>
                        <button
                          onClick={() => handleAddonChange('backups', selectedAddons.backups + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                      : `${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.text} hover:scale-105`
                  }`}
                >
                  <Server className="w-5 h-5 mr-2" />
                  Choose Plan
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Registration Section */}
      <section id="domains" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
              Domain Registration
            </h2>
            <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
              Secure your perfect domain name with competitive pricing and free privacy protection.
            </p>
          </div>

          <div className={`max-w-2xl mx-auto ${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8 mb-12`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted} w-5 h-5`} />
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder="Enter your domain name"
                  className={`w-full pl-12 pr-4 py-4 ${currentTheme.cardBg} ${currentTheme.border} border rounded-lg ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                />
              </div>
              <button
                onClick={handleDomainSearch}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className={`max-w-4xl mx-auto ${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>Search Results</h3>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 ${currentTheme.cardBg} ${currentTheme.border} border rounded-lg hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center space-x-4">
                      <Globe className={`w-6 h-6 ${result.available ? 'text-green-500' : 'text-red-500'}`} />
                      <div>
                        <span className={`text-lg font-semibold ${currentTheme.text}`}>
                          {result.domain}{result.tld}
                        </span>
                        <p className={`text-sm ${result.available ? 'text-green-500' : 'text-red-500'}`}>
                          {result.available ? 'Available' : 'Taken'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-xl font-bold ${currentTheme.text}`}>{result.price}/year</span>
                      {result.available && (
                        <button
                          onClick={() => handleDomainSelect(result)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {domainExtensions.map((ext, index) => (
              <div key={index} className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-xl p-4 text-center hover:scale-105 transition-all duration-300`}>
                <div className={`text-lg font-bold ${currentTheme.text} mb-1`}>{ext.tld}</div>
                <div className={`text-sm ${currentTheme.textMuted}`}>{ext.price}/year</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-8 h-8" />, number: '10,000+', label: 'Happy Gamers' },
              { icon: <Server className="w-8 h-8" />, number: '5,000+', label: 'Servers Hosted' },
              { icon: <TrendingUp className="w-8 h-8" />, number: '99.9%', label: 'Uptime' },
              { icon: <Heart className="w-8 h-8" />, number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className={`${currentTheme.cardBg} ${currentTheme.border} border rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300`}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl font-bold ${currentTheme.text} mb-2`}>{stat.number}</div>
                <div className={currentTheme.textMuted}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${currentTheme.cardBg} ${currentTheme.border} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>CraftDomains</h3>
              <p className={currentTheme.textMuted}>
                Premium domain registration and Minecraft hosting for Indian gamers.
              </p>
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Services</h4>
              <ul className={`space-y-2 ${currentTheme.textMuted}`}>
                <li>Minecraft Hosting</li>
                <li>Domain Registration</li>
                <li>DDoS Protection</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Support</h4>
              <ul className={`space-y-2 ${currentTheme.textMuted}`}>
                <li>Discord Community</li>
                <li>Knowledge Base</li>
                <li>Server Status</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Company</h4>
              <ul className={`space-y-2 ${currentTheme.textMuted}`}>
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${currentTheme.border} mt-8 pt-8 text-center ${currentTheme.textMuted}`}>
            <p>&copy; 2024 CraftDomains. All rights reserved. Made with ❤️ for Indian gamers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;