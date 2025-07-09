// SuperDatabase - Simple in-memory database with localStorage persistence
interface User {
  id: string;
  discordId: string;
  username: string;
  email: string;
  membershipType: 'normal' | 'premium';
  purchases: Purchase[];
  createdAt: string;
}

interface Purchase {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  price: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  purchaseDate: string;
  renewalDate: string;
  orderId: string;
}

interface Order {
  id: string;
  userId: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  price: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerInfo: any;
  createdAt: string;
  orderId: string;
}

interface SpecialOffer {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  originalPrice: string;
  discountPrice: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  createdAt: string;
}

interface Plan {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  category: string; // budget, powered, premium for minecraft/vps
  name: string;
  price: string;
  specs: any;
  isActive: boolean;
}

class SuperDatabase {
  private static instance: SuperDatabase;
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();
  private specialOffers: Map<string, SpecialOffer> = new Map();
  private coupons: Map<string, Coupon> = new Map();
  private plans: Map<string, Plan> = new Map();

  static getInstance(): SuperDatabase {
    if (!SuperDatabase.instance) {
      SuperDatabase.instance = new SuperDatabase();
    }
    return SuperDatabase.instance;
  }

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPlans();
  }

  private loadFromStorage() {
    try {
      const usersData = localStorage.getItem('superdb_users');
      const ordersData = localStorage.getItem('superdb_orders');
      const offersData = localStorage.getItem('superdb_offers');
      const couponsData = localStorage.getItem('superdb_coupons');
      const plansData = localStorage.getItem('superdb_plans');

      if (usersData) {
        const users = JSON.parse(usersData);
        this.users = new Map(users);
      }

      if (ordersData) {
        const orders = JSON.parse(ordersData);
        this.orders = new Map(orders);
      }

      if (offersData) {
        const offers = JSON.parse(offersData);
        this.specialOffers = new Map(offers);
      }

      if (couponsData) {
        const coupons = JSON.parse(couponsData);
        this.coupons = new Map(coupons);
      }

      if (plansData) {
        const plans = JSON.parse(plansData);
        this.plans = new Map(plans);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('superdb_users', JSON.stringify([...this.users]));
      localStorage.setItem('superdb_orders', JSON.stringify([...this.orders]));
      localStorage.setItem('superdb_offers', JSON.stringify([...this.specialOffers]));
      localStorage.setItem('superdb_coupons', JSON.stringify([...this.coupons]));
      localStorage.setItem('superdb_plans', JSON.stringify([...this.plans]));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private initializeDefaultPlans() {
    if (this.plans.size === 0) {
      // Initialize with default plans
      const defaultPlans = [
        // Minecraft Budget Plans
        { id: 'mc-budget-dirt', type: 'minecraft', category: 'budget', name: 'Dirt Plan', price: '₹49/mo', specs: { ram: '2GB', cpu: '100% CPU', storage: '5GB SSD' }, isActive: true },
        { id: 'mc-budget-wood', type: 'minecraft', category: 'budget', name: 'Wood Plan', price: '₹99/mo', specs: { ram: '4GB', cpu: '150% CPU', storage: '10GB SSD' }, isActive: true },
        // VPS Cheap Plans
        { id: 'vps-cheap-stone', type: 'vps', category: 'cheap', name: 'Stone Plan', price: '₹270/mo', specs: { ram: '2GB', cpu: '1 vCPU', storage: '20GB SSD' }, isActive: true },
        // Domain Plans
        { id: 'domain-com', type: 'domain', category: 'popular', name: '.com', price: '₹999/year', specs: { tld: '.com' }, isActive: true },
      ];

      defaultPlans.forEach(plan => {
        this.plans.set(plan.id, plan as Plan);
      });
      this.saveToStorage();
    }
  }

  // User Management
  createUser(discordUser: any): User {
    const user: User = {
      id: this.generateId(),
      discordId: discordUser.id,
      username: discordUser.username,
      email: discordUser.email,
      membershipType: 'normal',
      purchases: [],
      createdAt: new Date().toISOString()
    };

    this.users.set(user.id, user);
    this.saveToStorage();
    return user;
  }

  getUserByDiscordId(discordId: string): User | null {
    for (const user of this.users.values()) {
      if (user.discordId === discordId) {
        return user;
      }
    }
    return null;
  }

  updateUserMembership(userId: string, membershipType: 'normal' | 'premium'): boolean {
    const user = this.users.get(userId);
    if (user) {
      user.membershipType = membershipType;
      this.users.set(userId, user);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Order Management
  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const order: Order = {
      ...orderData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.orders.set(order.id, order);
    this.saveToStorage();
    return order;
  }

  confirmOrder(orderId: string): boolean {
    const order = Array.from(this.orders.values()).find(o => o.orderId === orderId);
    if (order) {
      order.status = 'confirmed';
      this.orders.set(order.id, order);

      // Add purchase to user
      const user = this.users.get(order.userId);
      if (user) {
        const purchase: Purchase = {
          id: this.generateId(),
          type: order.type,
          planName: order.planName,
          price: order.price,
          status: 'confirmed',
          purchaseDate: new Date().toISOString(),
          renewalDate: this.calculateRenewalDate(order.type),
          orderId: order.orderId
        };
        user.purchases.push(purchase);
        this.users.set(user.id, user);
      }

      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  // Special Offers Management
  createSpecialOffer(offerData: Omit<SpecialOffer, 'id' | 'createdAt'>): SpecialOffer {
    const offer: SpecialOffer = {
      ...offerData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.specialOffers.set(offer.id, offer);
    this.saveToStorage();
    return offer;
  }

  getActiveSpecialOffers(): SpecialOffer[] {
    return Array.from(this.specialOffers.values()).filter(offer => offer.isActive);
  }

  toggleSpecialOffer(offerId: string): boolean {
    const offer = this.specialOffers.get(offerId);
    if (offer) {
      offer.isActive = !offer.isActive;
      this.specialOffers.set(offerId, offer);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllSpecialOffers(): SpecialOffer[] {
    return Array.from(this.specialOffers.values());
  }

  // Coupon Management
  createCoupon(couponData: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>): Coupon {
    const coupon: Coupon = {
      ...couponData,
      id: this.generateId(),
      usedCount: 0,
      createdAt: new Date().toISOString()
    };

    this.coupons.set(coupon.id, coupon);
    this.saveToStorage();
    return coupon;
  }

  validateCoupon(code: string): Coupon | null {
    for (const coupon of this.coupons.values()) {
      if (coupon.code === code && coupon.isActive && 
          coupon.usedCount < coupon.usageLimit &&
          new Date(coupon.expiryDate) > new Date()) {
        return coupon;
      }
    }
    return null;
  }

  useCoupon(code: string): boolean {
    const coupon = this.validateCoupon(code);
    if (coupon) {
      coupon.usedCount++;
      this.coupons.set(coupon.id, coupon);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllCoupons(): Coupon[] {
    return Array.from(this.coupons.values());
  }

  // Plan Management
  updatePlan(planId: string, updates: Partial<Plan>): boolean {
    const plan = this.plans.get(planId);
    if (plan) {
      Object.assign(plan, updates);
      this.plans.set(planId, plan);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calculateRenewalDate(type: string): string {
    const now = new Date();
    if (type === 'domain') {
      now.setFullYear(now.getFullYear() + 1); // 1 year for domains
    } else {
      now.setMonth(now.getMonth() + 1); // 1 month for hosting
    }
    return now.toISOString();
  }

  // Analytics
  getAnalytics() {
    const totalUsers = this.users.size;
    const premiumUsers = Array.from(this.users.values()).filter(u => u.membershipType === 'premium').length;
    const totalOrders = this.orders.size;
    const confirmedOrders = Array.from(this.orders.values()).filter(o => o.status === 'confirmed').length;
    const pendingOrders = Array.from(this.orders.values()).filter(o => o.status === 'pending').length;
    const activeCoupons = Array.from(this.coupons.values()).filter(c => c.isActive).length;
    const activeOffers = Array.from(this.specialOffers.values()).filter(o => o.isActive).length;

    return {
      totalUsers,
      premiumUsers,
      normalUsers: totalUsers - premiumUsers,
      totalOrders,
      confirmedOrders,
      pendingOrders,
      activeCoupons,
      activeOffers
    };
  }
}

export const superDatabase = SuperDatabase.getInstance();
export type { User, Order, SpecialOffer, Coupon, Plan, Purchase };