import React, { useState } from 'react';
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
  Palette
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
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'glass'

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
          bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/70',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const ThemeToggle = () => (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      <div className={`${themeStyles.card} rounded-lg p-2 flex items-center space-x-1`}>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('glass')}
          className={`p-2 rounded-md transition-all ${theme === 'glass' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'}`}
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
    <div className={`min-h-screen ${themeStyles.bg}`}>
      <ThemeToggle />
      
      {/* Header */}
      <header className={`${themeStyles.card} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${themeStyles.text}`}>Demon Node™</h1>
                <p className={`text-sm ${themeStyles.textSecondary}`}>Premium Hosting Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#minecraft" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors`}>Minecraft</a>
              <a href="#domains" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors`}>Domains</a>
              <a href="#about" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors`}>About</a>
              <a href="#contact" className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors`}>Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold ${themeStyles.text} mb-6`}>
            Premium <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Gaming</span> & Domain Solutions
          </h1>
          <p className={`text-xl ${themeStyles.textSecondary} mb-8 max-w-3xl mx-auto`}>
            Experience blazing-fast Minecraft servers and secure domain registration designed specifically for Indian gamers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#minecraft" className={`${themeStyles.button} text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}>
              <Gamepad2 className="w-5 h-5 mr-2" />
              Explore Minecraft Plans
            </a>
            <a href="#domains" className={`${themeStyles.card} ${themeStyles.text} px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center`}>
              <Globe className="w-5 h-5 mr-2" />
              Register Domain
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${themeStyles.card} p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Lightning Fast</h3>
              <p className={themeStyles.textSecondary}>
                NVMe SSD storage and optimized servers ensure your Minecraft world loads instantly.
              </p>
            </div>
            <div className={`${themeStyles.card} p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>DDoS Protected</h3>
              <p className={themeStyles.textSecondary}>
                Enterprise-grade DDoS protection keeps your server online 24/7.
              </p>
            </div>
            <div className={`${themeStyles.card} p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>24/7 Support</h3>
              <p className={themeStyles.textSecondary}>
                Our expert team is always ready to help you with any issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minecraft Hosting Plans */}
      <section id="minecraft" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${themeStyles.text} mb-4`}>Minecraft Hosting Plans</h2>
            <p className={`text-xl ${themeStyles.textSecondary}`}>Choose the perfect plan for your Minecraft server</p>
          </div>

          {/* Budget Plans */}
          <div className="mb-16">
            <h3 className={`text-2xl font-bold ${themeStyles.text} mb-8 text-center`}>Budget Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.budget.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300`}>
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

                  <div className={`${themeStyles.card} p-4 rounded-lg mb-6`}>
                    <h5 className={`text-sm font-semibold ${themeStyles.text} mb-3`}>Add-ons Available:</h5>
                    <div className={`text-sm ${themeStyles.textSecondary} space-y-1`}>
                      <div>Extra Unit: {plan.addons.unit}/unit</div>
                      <div className="text-xs opacity-75">(1 GB RAM + 50% CPU + 5 GB SSD)</div>
                      <div>Backup Slot: {plan.addons.backup}/slot</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Powered Plans */}
          <div className="mb-16">
            <h3 className={`text-2xl font-bold ${themeStyles.text} mb-8 text-center`}>Powered Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.powered.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
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

                  <div className={`${themeStyles.card} p-4 rounded-lg mb-6`}>
                    <h5 className={`text-sm font-semibold ${themeStyles.text} mb-3`}>Add-ons Available:</h5>
                    <div className={`text-sm ${themeStyles.textSecondary} space-y-1`}>
                      <div>Extra Unit: {plan.addons.unit}/unit</div>
                      <div className="text-xs opacity-75">(1 GB RAM + 50% CPU + 5 GB SSD)</div>
                      <div>Backup Slot: {plan.addons.backup}/slot</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plans */}
          <div>
            <h3 className={`text-2xl font-bold ${themeStyles.text} mb-8 text-center`}>Premium Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {minecraftPlans.premium.map((plan, index) => (
                <div key={index} className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
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

                  <div className={`${themeStyles.card} p-4 rounded-lg mb-6`}>
                    <h5 className={`text-sm font-semibold ${themeStyles.text} mb-3`}>Add-ons Available:</h5>
                    <div className={`text-sm ${themeStyles.textSecondary} space-y-1`}>
                      <div>Extra Unit: {plan.addons.unit}/unit</div>
                      <div className="text-xs opacity-75">(1 GB RAM + 50% CPU + 5 GB SSD)</div>
                      <div>Backup Slot: {plan.addons.backup}/slot</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${themeStyles.button} text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
                  >
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
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
            <h2 className={`text-4xl font-bold ${themeStyles.text} mb-4`}>Domain Registration</h2>
            <p className={`text-xl ${themeStyles.textSecondary}`}>Secure your perfect domain name today</p>
          </div>

          <div className={`${themeStyles.card} p-8 rounded-2xl mb-8`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your domain name"
                  className={`w-full px-4 py-3 ${themeStyles.card} border border-white/20 rounded-lg ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                />
              </div>
              <button
                onClick={handleDomainSearch}
                className={`${themeStyles.button} text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className={`${themeStyles.card} rounded-2xl overflow-hidden`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Search Results</h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 ${themeStyles.card} rounded-lg`}>
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
                            className={`${themeStyles.button} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300`}
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
              <div key={index} className={`${themeStyles.card} p-4 rounded-lg text-center`}>
                <div className={`font-bold ${themeStyles.text} mb-1`}>{ext.tld}</div>
                <div className={`text-sm ${themeStyles.textSecondary}`}>{ext.price}/year</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${themeStyles.card} border-t py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${themeStyles.text}`}>Demon Node™</span>
              </div>
              <p className={`${themeStyles.textSecondary} text-sm`}>
                Premium hosting solutions designed for Indian gamers and businesses.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Services</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li>Minecraft Hosting</li>
                <li>Domain Registration</li>
                <li>DDoS Protection</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Company</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li>About Us</li>
                <li>Contact</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-4`}>Connect</h4>
              <ul className={`space-y-2 text-sm ${themeStyles.textSecondary}`}>
                <li>Discord Server</li>
                <li>Support Tickets</li>
                <li>Status Page</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-white/20 mt-8 pt-8 text-center ${themeStyles.textSecondary} text-sm`}>
            <p>&copy; 2024 Demon Node™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;