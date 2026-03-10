export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  address?: Address;
  createdAt: Date;
}

export interface Address {
  id: string;
  street: string;
  district: string;
  city: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Seller {
  id: string;
  userId: string;
  name: string;
  description: string;
  story: string;
  avatar: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  address: Address;
  distance?: number;
  products: Product[];
  createdAt: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: Seller;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  category: ProductCategory;
  images: string[];
  dietary: DietaryTag[];
  inStock: boolean;
  availableNow: boolean;
  preOrder: boolean;
  quantity?: number;
  coldChain: boolean;
  organic: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  sourcing: string;
  views: number;
  createdAt: Date;
}

export type ProductCategory = 
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'meat'
  | 'eggs'
  | 'seafood'
  | 'grains'
  | 'herbs'
  | 'honey'
  | 'processed'
  | 'bakery'
  | 'beverages'
  | 'other';

export type DietaryTag = 
  | 'vegan'
  | 'vegetarian'
  | 'organic'
  | 'halal'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'keto'
  | 'low-carb';

export interface CartItem {
  product: Product;
  quantity: number;
  sellerId: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  sellerId: string;
  status: OrderStatus;
  fulfillment: Fulfillment;
  payment: Payment;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded';

export interface Fulfillment {
  type: 'pickup' | 'delivery' | 'drop-off';
  address?: Address;
  pickupPoint?: PickupPoint;
  scheduledTime?: Date;
  timeSlot?: TimeSlot;
  deliveryPartner?: string;
  trackingUrl?: string;
  coldChain: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: Address;
  hours: string;
}

export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export type PaymentMethod = 
  | 'cash'
  | 'e-wallet'
  | 'bank_transfer'
  | 'credit_card';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface Review {
  id: string;
  orderId: string;
  productId?: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  type: 'recipe' | 'tip' | 'announcement' | 'event' | 'group_buy';
  title: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  eventDate?: Date;
  eventLocation?: string;
  groupBuyDetails?: GroupBuyDetails;
  createdAt: Date;
}

export interface GroupBuyDetails {
  productId: string;
  productName: string;
  targetQuantity: number;
  currentQuantity: number;
  discount: number;
  endsAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'farmers_market' | 'cooking_class' | 'pop-up' | 'workshop';
  date: Date;
  location: string;
  address: Address;
  image: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'review' | 'promotion' | 'community' | 'system';
  title: string;
  body: string;
  read: boolean;
  data?: any;
  createdAt: Date;
}

export interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  views: number;
  topProducts: Product[];
  recentOrders: Order[];
}
