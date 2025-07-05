import React from 'react';
import { Cpu, HardDrive, MapPin, CheckCircle, ArrowRight, Star, Zap } from 'lucide-react';

interface PlanCardProps {
  plan: {
    name: string;
    price: string;
    ram: string;
    cpu: string;
    storage: string;
    location: string;
    features?: string[];
    addons?: {
      unit: string;
      backup: string;
    };
  };
  planType: 'budget' | 'powered' | 'premium';
  isPopular?: boolean;
  theme?: string;
  onSelect?: (plan: any) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  planType, 
  isPopular = false, 
  theme = 'dark', 
  onSelect 
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          glowButton: 'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
        };
      default: // dark
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const getPlanTypeColor = () => {
    switch (planType) {
      case 'budget':
        return 'border-green-500/30 hover:border-green-500/50';
      case 'powered':
        return 'border-orange-500/30 hover:border-orange-500/50';
      case 'premium':
        return 'border-purple-500/30 hover:border-purple-500/50';
      default:
        return 'border-white/20 hover:border-white/30';
    }
  };

  const getPlanBadge = () => {
    switch (planType) {
      case 'budget':
        return (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Free DDoS Protection
          </div>
        );
      case 'powered':
        return (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            Powered by Ryzen 9
          </div>
        );
      case 'premium':
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Premium Node Quality
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 relative border ${getPlanTypeColor()}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Badge */}
      <div className="flex justify-center mb-4">
        {getPlanBadge()}
      </div>

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h4 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>{plan.name}</h4>
        <div className={`text-4xl font-bold ${themeStyles.text} mb-1`}>{plan.price}</div>
        <div className={`${themeStyles.textSecondary} text-sm`}>per month</div>
      </div>
      
      {/* Specs */}
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

      {/* Features */}
      {plan.features && (
        <div className="space-y-2 mb-6">
          {plan.features.map((feature, idx) => (
            <div key={idx} className={`flex items-center ${themeStyles.textSecondary}`}>
              <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add-ons */}
      {plan.addons && (
        <div className={`${themeStyles.card} p-4 rounded-lg mb-6 border border-white/10`}>
          <h5 className={`text-sm font-semibold ${themeStyles.text} mb-3`}>Add-ons Available:</h5>
          <div className={`text-sm ${themeStyles.textSecondary} space-y-1`}>
            <div>Extra Unit: {plan.addons.unit}/unit</div>
            <div className="text-xs opacity-75">(1 GB RAM + 50% CPU + 5 GB SSD)</div>
            <div>Backup Slot: {plan.addons.backup}/slot</div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onSelect && onSelect(plan)}
        className={`w-full ${themeStyles.button} ${themeStyles.glowButton} text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group`}
      >
        Choose Plan
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default PlanCard;