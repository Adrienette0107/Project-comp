import { create, persist } from './zustand-mock';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'booking-request';
  mediaUrl?: string;
  bookingRequest?: {
    bookingId: string;
    toolId: string;
    toolName: string;
    toolImage?: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    securityDeposit: number;
    status: 'pending' | 'approved' | 'rejected';
  };
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  mutualFriends?: number;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  friends: Friend[];
  isTyping: boolean;
  typingUser: string | null;
  fetchChats: () => void;
  fetchMessages: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, type?: string, mediaUrl?: string) => void;
  createChat: (participantIds: string[], type?: 'direct' | 'group', name?: string) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  setCurrentChat: (chat: Chat | null) => void;
  sendBookingRequest: (chatId: string, booking: any) => void;
  updateBookingStatus: (messageId: string, status: 'approved' | 'rejected') => void;
}

const mockFriends: Friend[] = [
  {
    id: '2',
    name: 'Ramesh Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    mutualFriends: 5
  },
  {
    id: '3',
    name: 'Suresh Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    mutualFriends: 3
  },
  {
    id: '4',
    name: 'Amit Singh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    mutualFriends: 8
  },
  {
    id: '5',
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    mutualFriends: 2
  }
];

const mockChats: Chat[] = [
  {
    id: '1',
    type: 'direct',
    participants: [
      {
        id: '1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
        isOnline: true
      },
      {
        id: '2',
        name: 'Ramesh Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'm1',
      chatId: '1',
      senderId: '2',
      senderName: 'Ramesh Patel',
      content: 'Hi, is the tractor still available for rent?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    unreadCount: 1,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    type: 'direct',
    participants: [
      {
        id: '1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
        isOnline: true
      },
      {
        id: '5',
        name: 'Priya Sharma',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ],
    lastMessage: {
      id: 'm2',
      chatId: '2',
      senderId: '1',
      senderName: 'You',
      content: 'Thanks for the sprayer!',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    unreadCount: 0,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    type: 'group',
    name: 'Pune Farmers Group',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=group1',
    participants: [
      {
        id: '1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
        isOnline: true
      },
      {
        id: '2',
        name: 'Ramesh Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh',
        isOnline: true
      },
      {
        id: '3',
        name: 'Suresh Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
        isOnline: false
      },
      {
        id: '4',
        name: 'Amit Singh',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'm3',
      chatId: '3',
      senderId: '4',
      senderName: 'Amit Singh',
      content: 'Wheat prices are going up!',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    unreadCount: 3,
    createdAt: '2024-02-01'
  }
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      chatId: '1',
      senderId: '1',
      senderName: 'You',
      content: 'Hello! How can I help you?',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 'm1-2',
      chatId: '1',
      senderId: '2',
      senderName: 'Ramesh Patel',
      content: 'Hi, is the tractor still available for rent?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  ],
  '2': [
    {
      id: 'm2-1',
      chatId: '2',
      senderId: '5',
      senderName: 'Priya Sharma',
      content: 'The sprayer is ready for pickup',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      id: 'm2-2',
      chatId: '2',
      senderId: '1',
      senderName: 'You',
      content: 'Thanks for the sprayer!',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ],
  '3': [
    {
      id: 'm3-1',
      chatId: '3',
      senderId: '2',
      senderName: 'Ramesh Patel',
      content: 'Anyone selling wheat seeds?',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'm3-2',
      chatId: '3',
      senderId: '3',
      senderName: 'Suresh Patel',
      content: 'I have some extra',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 'm3-3',
      chatId: '3',
      senderId: '4',
      senderName: 'Amit Singh',
      content: 'Wheat prices are going up!',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ]
};

export const useChatStore = create<ChatState>(persist((set, get) => ({
  chats: mockChats,
  currentChat: null,
  messages: [],
  friends: mockFriends,
  isTyping: false,
  typingUser: null,

  fetchChats: () => {
    set({ chats: mockChats });
  },

  fetchMessages: (chatId: string) => {
    const messages = mockMessages[chatId] || [];
    set({ messages });
  },

  sendMessage: (chatId: string, content: string, type = 'text', mediaUrl?: string) => {
    const { messages, chats } = get();
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId,
      senderId: '1',
      senderName: 'You',
      content,
      type: type as any,
      mediaUrl,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    set({
      messages: [...messages, newMessage]
    });

    // Update last message in chat
    set({
      chats: chats.map(c =>
        c.id === chatId
          ? { ...c, lastMessage: newMessage }
          : c
      )
    });
  },

  createChat: (participantIds: string[], type = 'direct', name?: string) => {
    const { chats, friends } = get();
    const participants = [
      {
        id: '1',
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
        isOnline: true
      },
      ...participantIds.map(id => {
        const friend = friends.find(f => f.id === id);
        return {
          id,
          name: friend?.name || 'Unknown',
          avatar: friend?.avatar,
          isOnline: friend?.isOnline || false
        };
      })
    ];

    const newChat: Chat = {
      id: `${Date.now()}`,
      type: type as 'direct' | 'group',
      name: type === 'group' ? name : undefined,
      participants,
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };

    set({ chats: [newChat, ...chats] });
  },

  markAsRead: (chatId: string) => {
    const { chats, messages } = get();
    set({
      chats: chats.map(c =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
      messages: messages.map(m =>
        m.chatId === chatId && m.senderId !== '1'
          ? { ...m, isRead: true }
          : m
      )
    });
  },

  setTyping: (chatId: string, isTyping: boolean) => {
    set({
      isTyping,
      typingUser: isTyping ? 'other' : null
    });
  },

  addFriend: (friendId: string) => {
    // In real app, would make API call
  },

  removeFriend: (friendId: string) => {
    const { friends } = get();
    set({ friends: friends.filter(f => f.id !== friendId) });
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat });
  },

  sendBookingRequest: (chatId: string, booking: any) => {
    const { messages, chats } = get();
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId,
      senderId: '1',
      senderName: 'You',
      content: `Booking request for ${booking.toolName}`,
      type: 'booking-request',
      bookingRequest: {
        bookingId: booking.id,
        toolId: booking.toolId,
        toolName: booking.toolName,
        toolImage: booking.toolImage,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        securityDeposit: booking.securityDeposit,
        status: 'pending'
      },
      isRead: false,
      createdAt: new Date().toISOString()
    };

    set({
      messages: [...messages, newMessage]
    });

    // Update last message in chat
    set({
      chats: chats.map(c =>
        c.id === chatId
          ? { ...c, lastMessage: newMessage }
          : c
      )
    });
  },

  updateBookingStatus: (messageId: string, status: 'approved' | 'rejected') => {
    const { messages } = get();
    set({
      messages: messages.map(m =>
        m.id === messageId && m.bookingRequest
          ? { ...m, bookingRequest: { ...m.bookingRequest, status } }
          : m
      )
    });
  }
}), { name: 'chat-storage' }));
