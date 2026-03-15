import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Send,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Users,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useChatStore, type Message } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { useToolsStore } from '../stores/toolsStore';

export function ChatSystem() {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    currentChat,
    messages,
    friends,
    isTyping,
    fetchChats,
    fetchMessages,
    sendMessage,
    createChat,
    markAsRead,
    setTyping,
    setCurrentChat,
    sendBookingRequest,
    updateBookingStatus
  } = useChatStore();
  const { isAuthenticated } = useAuthStore();
  const { removeToolFromListing, removeLandFromListing, respondToBooking } = useToolsStore();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat.id);
      markAsRead(currentChat.id);
    }
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && currentChat) {
      sendMessage(currentChat.id, messageInput);
      setMessageInput('');

      // Simulate typing indicator
      setTimeout(() => {
        setTyping(currentChat.id, true);
        setTimeout(() => {
          setTyping(currentChat.id, false);
        }, 2000);
      }, 500);
    }
  };

  const handleChatSelect = (chat: any) => {
    setCurrentChat(chat);
    setIsMobileChatOpen(true);
  };

  const handleAcceptBooking = (message: any) => {
    if (message.bookingRequest) {
      // Update booking status in chat message
      updateBookingStatus(message.id, 'approved');

      // Update booking status in tools store
      respondToBooking(message.bookingRequest.bookingId, 'approved');

      // Remove from listing
      removeToolFromListing(message.bookingRequest.toolId);
      removeLandFromListing(message.bookingRequest.toolId);

      alert('Booking accepted! The listing has been removed.');
    }
  };

  const handleRejectBooking = (message: any) => {
    if (message.bookingRequest) {
      // Update booking status in chat message
      updateBookingStatus(message.id, 'rejected');

      // Update booking status in tools store
      respondToBooking(message.bookingRequest.bookingId, 'rejected');

      alert('Booking rejected.');
    }
  };

  const filteredChats = chats.filter(chat => {
    const chatName = chat.type === 'group'
      ? chat.name
      : chat.participants.find(p => p.id !== '1')?.name;
    return chatName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">Please login to access chat</h2>
          <p className="text-gray-400 mt-2">Connect with farmers and buyers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`w-full sm:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col ${isMobileChatOpen ? 'hidden sm:flex' : 'flex'
              }`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Messages</h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsNewChatDialogOpen(true)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-2 mx-4 mt-2">
                  <TabsTrigger value="chats">Chats</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>

                <TabsContent value="chats" className="flex-1 overflow-y-auto m-0">
                  {filteredChats.map((chat) => {
                    const otherParticipant = chat.participants.find(p => p.id !== '1');
                    const chatName = chat.type === 'group' ? chat.name : otherParticipant?.name;
                    const chatAvatar = chat.type === 'group' ? chat.avatar : otherParticipant?.avatar;
                    const isOnline = chat.type === 'direct' ? otherParticipant?.isOnline : false;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentChat?.id === chat.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={chatAvatar} />
                            <AvatarFallback>{chatName?.[0]}</AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{chatName}</h3>
                            {chat.lastMessage && (
                              <span className="text-xs text-gray-400">
                                {formatTime(chat.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {chat.type === 'group' && chat.lastMessage && (
                                <span className="font-medium">{chat.lastMessage.senderName}: </span>
                              )}
                              {chat.lastMessage?.content}
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-green-500 text-white ml-2">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                <TabsContent value="friends" className="flex-1 overflow-y-auto m-0">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => createChat([friend.id])}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{friend.name}</h3>
                        <p className="text-sm text-gray-500">
                          {friend.isOnline ? 'Online' : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!isMobileChatOpen ? 'hidden sm:flex' : 'flex'
              }`}>
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="sm:hidden"
                        onClick={() => setIsMobileChatOpen(false)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={currentChat.type === 'group'
                              ? currentChat.avatar
                              : currentChat.participants.find(p => p.id !== '1')?.avatar
                            }
                          />
                          <AvatarFallback>
                            {(currentChat.type === 'group'
                              ? currentChat.name
                              : currentChat.participants.find(p => p.id !== '1')?.name
                            )?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {currentChat.type === 'direct' &&
                          currentChat.participants.find(p => p.id !== '1')?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                          )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {currentChat.type === 'group'
                            ? currentChat.name
                            : currentChat.participants.find(p => p.id !== '1')?.name
                          }
                        </h3>
                        <p className="text-xs text-gray-500">
                          {currentChat.type === 'group'
                            ? `${currentChat.participants.length} members`
                            : currentChat.participants.find(p => p.id !== '1')?.isOnline
                              ? 'Online'
                              : 'Offline'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Video className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {(Object.entries(
                      messages.reduce((groups, message) => {
                        const date = new Date(message.createdAt).toLocaleDateString();
                        if (!groups[date]) groups[date] = [];
                        groups[date].push(message);
                        return groups;
                      }, {} as Record<string, Message[]>)
                    ) as [string, Message[]][]).map(([date, groupMessages]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex justify-center">
                          <span className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 px-3 py-1 rounded-full">
                            {date === new Date().toLocaleDateString() ? 'Today' : date}
                          </span>
                        </div>
                        {groupMessages.map((message, index) => {
                          const isMe = message.senderId === '1'; // Assuming '1' is current user for now, ideally get from authStore
                          const showAvatar = index === 0 || groupMessages[index - 1].senderId !== message.senderId;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                                {!isMe && showAvatar ? (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={message.senderAvatar} />
                                    <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                                  </Avatar>
                                ) : !isMe && <div className="w-8" />}

                                <div
                                  className={`px-4 py-2 rounded-2xl shadow-sm ${isMe
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 rounded-bl-none border border-gray-100 dark:border-gray-600'
                                    }`}
                                >
                                  {message.type === 'booking-request' && message.bookingRequest ? (
                                    <div className="space-y-3 min-w-[200px]">
                                      <div className="font-semibold flex items-center gap-2">
                                        {message.bookingRequest.status === 'pending' && <span>📋 Booking Request</span>}
                                        {message.bookingRequest.status === 'approved' && <span>✅ Booking Approved</span>}
                                        {message.bookingRequest.status === 'rejected' && <span>❌ Booking Rejected</span>}
                                      </div>
                                      <div className={`p-3 rounded-lg ${isMe ? 'bg-green-700/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                        <p className="font-medium">{message.bookingRequest.toolName}</p>
                                        <div className="text-sm opacity-90 mt-2 space-y-1">
                                          <div className="flex justify-between">
                                            <span>Start:</span>
                                            <span>{new Date(message.bookingRequest.startDate).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>End:</span>
                                            <span>{new Date(message.bookingRequest.endDate).toLocaleDateString()}</span>
                                          </div>
                                          <div className="border-t border-current/20 my-1 pt-1 flex justify-between font-medium">
                                            <span>Total:</span>
                                            <span>₹{message.bookingRequest.totalAmount}</span>
                                          </div>
                                        </div>
                                      </div>
                                      {message.bookingRequest.status === 'pending' && !isMe && (
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleAcceptBooking(message)}
                                          >
                                            Accept
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                                            onClick={() => handleRejectBooking(message)}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                      {message.bookingRequest.status !== 'pending' && (
                                        <div className="flex justify-center">
                                          <Badge className={
                                            message.bookingRequest.status === 'approved'
                                              ? 'bg-green-500'
                                              : 'bg-red-500'
                                          }>
                                            {message.bookingRequest.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <>
                                      {message.type === 'image' && message.mediaUrl && (
                                        <img
                                          src={message.mediaUrl}
                                          alt="Shared image"
                                          className="max-w-full rounded-lg mb-2"
                                        />
                                      )}
                                      <p className="text-sm leading-relaxed">{message.content}</p>
                                    </>
                                  )}
                                  <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                                    <span className="text-[10px] opacity-70">{formatTime(message.createdAt)}</span>
                                    {isMe && (
                                      message.isRead
                                        ? <CheckCheck className="w-3 h-3 opacity-70" />
                                        : <Check className="w-3 h-3 opacity-70" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button size="icon" variant="ghost">
                        <Smile className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">Select a chat to start messaging</h3>
                    <p className="text-gray-400">Connect with farmers and buyers</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Search farmers..." />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Suggested</p>
              {friends.slice(0, 3).map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => {
                    createChat([friend.id]);
                    setIsNewChatDialogOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">
                      {friend.mutualFriends} mutual friends
                    </p>
                  </div>
                  <Button size="sm">Message</Button>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setIsNewChatDialogOpen(false);
                setActiveTab('friends');
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              View All Friends
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
