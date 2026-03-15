import { create, persist } from './zustand-mock';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  farmDetails?: {
    farmName: string;
    farmSize: number;
    crops: string[];
    soilType: string;
  };
  preferredLanguage: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  allUsers: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (data: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  switchUser: (userId: string) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'admin';
  farmName?: string;
  farmSize?: number;
  location?: string;
  preferredLanguage?: string;
}

// Mock users for demonstration - 5 Sample Farmers
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'farmer',
    phone: '+91 98765 43210',
    location: {
      latitude: 30.7333,
      longitude: 76.7794,
      address: 'Ludhiana, Punjab'
    },
    farmDetails: {
      farmName: 'Golden Harvest Farm',
      farmSize: 10.0,
      crops: ['Wheat', 'Rice', 'Cotton'],
      soilType: 'Alluvial'
    },
    preferredLanguage: 'hi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'farmer',
    phone: '+91 98765 43211',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Nashik, Maharashtra'
    },
    farmDetails: {
      farmName: 'Organic Green Farm',
      farmSize: 6.5,
      crops: ['Tomato', 'Cucumber', 'Spinach', 'Lettuce'],
      soilType: 'Red Soil'
    },
    preferredLanguage: 'mr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'farmer',
    phone: '+91 98765 43212',
    location: {
      latitude: 23.0225,
      longitude: 72.5714,
      address: 'Ahmedabad, Gujarat'
    },
    farmDetails: {
      farmName: 'Patel Cotton Estate',
      farmSize: 15.0,
      crops: ['Cotton', 'Groundnut', 'Pearl Millet'],
      soilType: 'Black Cotton Soil'
    },
    preferredLanguage: 'gu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Lakshmi Reddy',
    email: 'lakshmi@example.com',
    role: 'farmer',
    phone: '+91 98765 43213',
    location: {
      latitude: 16.5062,
      longitude: 80.6480,
      address: 'Vijayawada, Andhra Pradesh'
    },
    farmDetails: {
      farmName: 'Reddy Rice Fields',
      farmSize: 8.0,
      crops: ['Rice', 'Maize', 'Chili'],
      soilType: 'Clayey'
    },
    preferredLanguage: 'te',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lakshmi',
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'Suresh Singh',
    email: 'suresh@example.com',
    role: 'farmer',
    phone: '+91 98765 43214',
    location: {
      latitude: 26.8467,
      longitude: 80.9462,
      address: 'Lucknow, Uttar Pradesh'
    },
    farmDetails: {
      farmName: 'Singh Multi-Crop Farm',
      farmSize: 12.0,
      crops: ['Sugarcane', 'Potato', 'Mustard', 'Wheat'],
      soilType: 'Loamy'
    },
    preferredLanguage: 'hi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    createdAt: '2024-02-15'
  }
];

export const useAuthStore = create<AuthState>(
  persist(
    (set: any, get: any) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      allUsers: mockUsers,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          set({
            user,
            isAuthenticated: true,
            token: `mock-jwt-token-${user.id}`
          });
          return true;
        }
        return false;
      },

      register: async (userData: RegisterData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
          id: `${mockUsers.length + 1}`,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          location: {
            latitude: 20.5937,
            longitude: 78.9629,
            address: userData.location || 'India'
          },
          farmDetails: userData.farmName ? {
            farmName: userData.farmName,
            farmSize: userData.farmSize || 0,
            crops: [],
            soilType: 'Unknown'
          } : undefined,
          preferredLanguage: userData.preferredLanguage || 'en',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
          createdAt: new Date().toISOString()
        };

        mockUsers.push(newUser);
        set({
          user: newUser,
          isAuthenticated: true,
          token: `mock-jwt-token-${newUser.id}`
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },

      checkAuth: () => {
        const { token, user } = get();
        if (token && user) {
          set({ isAuthenticated: true });
        }
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },

      forgotPassword: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = mockUsers.find(u => u.email === email);
        return !!user;
      },

      switchUser: (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          set({
            user,
            isAuthenticated: true,
            token: `mock-jwt-token-${user.id}`
          });
        }
      }
    }),
    { name: 'auth-storage' }
  )
);
