import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, Gamepad2, ExternalLink, Plus, Minus } from 'lucide-react';

interface PaymentFormProps {
  selectedPlan: any;
  selectedAddons: any;
  onBack: () => void;
  theme: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ selectedPlan, selectedAddons, onBack, theme }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    country: '',
    discordUsername: '',
    serverName: ''
  });

  const [localAddons, setLocalAddons] = useState(selectedAddons);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddonChange = (type: string, value: number) => {
    setLocalAddons((prev: any) => ({
      ...prev,
      [type]: Math.max(0, value)
    }));
  };

  const calculateTotal = () => {
    const basePrice = parseInt(selectedPlan.price.replace('₹', ''));
    const unitsPrice = (localAddons?.units || 0) * parseInt(selectedPlan.addons.unit.replace('₹', ''));
    const backupsPrice = (localAddons?.backups || 0) * parseInt(selectedPlan.addons.backup.replace('₹', ''));
    return basePrice + unitsPrice + backupsPrice;
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/70',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          input: 'bg-white/5 border-white/10 text-white placeholder-white/50'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          input: 'bg-white/10 border-white/20 text-white placeholder-gray-400'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const sendToDiscord = async () => {
    const webhookUrl = 'https://discord.com/api/webhooks/1390708963229831180/iIcQEkMPv1_bWKzvg58UWBq-c84msuMit4Sh6aw5xa4HaCYyUgdl3fA82W8g2vZLofsp';

    const orderDetails = {
      embeds: [
        {
          title: "🎮 New Minecraft Hosting Order!",
          color: 0x7C3AED,
          fields: [
            {
              name: "👤 Customer Information",
              value: `**Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Phone:** ${formData.phone}\n**Discord:** ${formData.discordUsername}`,
              inline: false
            },
            {
              name: "📍 Address",
              value: `${formData.address}\n${formData.state}, ${formData.country}`,
              inline: false
            },
            {
              name: "🎯 Plan Details",
              value: `**Plan:** ${selectedPlan.name} Plan\n**Type:** ${selectedPlan.planType}\n**RAM:** ${selectedPlan.ram}\n**CPU:** ${selectedPlan.cpu}\n**Storage:** ${selectedPlan.storage}\n**Location:** ${selectedPlan.location}`,
              inline: true
            },
            {
              name: "🔧 Add-ons",
              value: `**Extra Units:** ${localAddons?.units || 0}\n**Backup Slots:** ${localAddons?.backups || 0}`,
              inline: true
            },
            {
              name: "💰 Pricing",
              value: `**Base Price:** ₹${selectedPlan.price.replace('₹', '')}\n**Add-ons:** ₹${((localAddons?.units || 0) * parseInt(selectedPlan.addons.unit.replace('₹', ''))) + ((localAddons?.backups || 0) * parseInt(selectedPlan.addons.backup.replace('₹', '')))}\n**Total:** ₹${calculateTotal()}`,
              inline: true
            },
            {
              name: "🎮 Server Details",
              value: `**Server Name:** ${formData.serverName || 'Not specified'}`,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Demon Node™ Minecraft Hosting"
          }
        }
      ]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to send to Discord');
      }
    } catch (error) {
      console.error('Error sending to Discord:', error);
      setIsSubmitted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendToDiscord();
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 text-center`}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Order Submitted Successfully!</h2>
          <p className={`${themeStyles.textSecondary} mb-6`}>
            Your Minecraft hosting order has been received. Our team will contact you on Discord to confirm your order and set up your server.
          </p>
          
          <div className="mb-6">
            <a
              href="https://discord.gg/your-server-invite"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${themeStyles.button} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center mb-4`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord Server
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <p className={`text-sm ${themeStyles.textSecondary}`}>
              Join our Discord server to confirm your order and get support from our team.
            </p>
          </div>

          <button
            onClick={onBack}
            className={`w-full ${themeStyles.button} text-white py-3 rounded-lg font-semibold transition-all duration-300`}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className={`${themeStyles.card} rounded-2xl p-6 h-fit`}>
            <h2 className={`text-2xl font-bold ${themeStyles.text} mb-6`}>Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className={`flex items-center space-x-4 p-4 ${themeStyles.card} rounded-xl`}>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${themeStyles.text}`}>{selectedPlan.name} Plan</h3>
                  <p className={themeStyles.textSecondary}>{selectedPlan.planType}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-xl font-bold ${themeStyles.text}`}>{selectedPlan.price}</div>
                  <div className={`text-sm ${themeStyles.textSecondary}`}>/month</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>RAM:</span>
                  <span>{selectedPlan.ram}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>CPU:</span>
                  <span>{selectedPlan.cpu}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>Storage:</span>
                  <span>{selectedPlan.storage}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>Location:</span>
                  <span>{selectedPlan.location}</span>
                </div>
              </div>
            </div>

            {/* Add-ons Configuration */}
            <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} pt-6 mb-6`}>
              <h4 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Configure Add-ons</h4>
              
              {/* Extra Units */}
              <div className={`${themeStyles.card} p-4 rounded-lg mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className={`font-semibold ${themeStyles.text}`}>Extra Units</h5>
                    <p className={`text-sm ${themeStyles.textSecondary}`}>1 GB RAM + 50% CPU + 5 GB SSD</p>
                    <p className={`text-sm font-semibold ${themeStyles.text}`}>{selectedPlan.addons.unit}/unit</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleAddonChange('units', (localAddons?.units || 0) - 1)}
                      className={`w-8 h-8 ${themeStyles.button} text-white rounded-full flex items-center justify-center`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`w-8 text-center font-semibold ${themeStyles.text}`}>
                      {localAddons?.units || 0}
                    </span>
                    <button
                      onClick={() => handleAddonChange('units', (localAddons?.units || 0) + 1)}
                      className={`w-8 h-8 ${themeStyles.button} text-white rounded-full flex items-center justify-center`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {(localAddons?.units || 0) > 0 && (
                  <div className={`text-right text-sm ${themeStyles.textSecondary}`}>
                    Subtotal: ₹{(localAddons?.units || 0) * parseInt(selectedPlan.addons.unit.replace('₹', ''))}
                  </div>
                )}
              </div>

              {/* Backup Slots */}
              <div className={`${themeStyles.card} p-4 rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className={`font-semibold ${themeStyles.text}`}>Backup Slots</h5>
                    <p className={`text-sm ${themeStyles.textSecondary}`}>Additional backup storage</p>
                    <p className={`text-sm font-semibold ${themeStyles.text}`}>{selectedPlan.addons.backup}/slot</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleAddonChange('backups', (localAddons?.backups || 0) - 1)}
                      className={`w-8 h-8 ${themeStyles.button} text-white rounded-full flex items-center justify-center`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`w-8 text-center font-semibold ${themeStyles.text}`}>
                      {localAddons?.backups || 0}
                    </span>
                    <button
                      onClick={() => handleAddonChange('backups', (localAddons?.backups || 0) + 1)}
                      className={`w-8 h-8 ${themeStyles.button} text-white rounded-full flex items-center justify-center`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {(localAddons?.backups || 0) > 0 && (
                  <div className={`text-right text-sm ${themeStyles.textSecondary}`}>
                    Subtotal: ₹{(localAddons?.backups || 0) * parseInt(selectedPlan.addons.backup.replace('₹', ''))}
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} pt-4`}>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${themeStyles.text}`}>Total</span>
                <span className="text-2xl font-bold text-purple-400">₹{calculateTotal()}/mo</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className={`${themeStyles.card} rounded-2xl p-6`}>
            <h2 className={`text-2xl font-bold ${themeStyles.text} mb-6`}>Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Discord Username *
                </label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter Discord username"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Gamepad2 className="w-4 h-4 inline mr-2" />
                  Server Name (Optional)
                </label>
                <input
                  type="text"
                  name="serverName"
                  value={formData.serverName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter desired server name"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${themeStyles.button} disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Order
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;