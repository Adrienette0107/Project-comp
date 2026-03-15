import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { FarmHealth } from './sections/FarmHealth';
import Recommendations from './sections/Recommendations';
import { ToolsLending } from './sections/ToolsLending';
import { MarketSection } from './sections/MarketSection';
import { ChatSystem } from './sections/ChatSystem';
import { GovernmentSchemes } from './sections/GovernmentSchemes';
import { Dashboard } from './sections/Dashboard';
import { Profile } from './sections/Profile';
import { AuthModal } from './components/modals/AuthModal';
import { AIChatbot } from './components/AIChatbot';
import { NotificationPanel } from './components/NotificationPanel';
import { UserSwitcher } from './components/UserSwitcher';
import { Footer } from './sections/Footer';
import { useAuthStore } from './stores/authStore';
import { useChatStore } from './stores/chatStore';
import { useNotificationStore } from './stores/notificationStore';
import './App.css';

export type Section =
  | 'home'
  | 'farm-health'
  | 'recommendations'
  | 'market'
  | 'tools-lending'
  | 'chat'
  | 'government-schemes'
  | 'dashboard'
  | 'profile';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, checkAuth, fetchNotifications]);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavigateToChat = (ownerId: string) => {
    const { chats, createChat, setCurrentChat } = useChatStore.getState();

    // Check if chat already exists with this owner
    const existingChat = chats.find(chat =>
      chat.type === 'direct' &&
      chat.participants.some(p => p.id === ownerId)
    );

    if (existingChat) {
      // Open existing chat
      setCurrentChat(existingChat);
      setCurrentSection('chat');
    } else {
      // Create new chat
      createChat([ownerId]);
      // Wait a bit for the store to update, then get the new chat
      setTimeout(() => {
        const { chats: updatedChats } = useChatStore.getState();
        const newChat = updatedChats.find(chat =>
          chat.type === 'direct' &&
          chat.participants.some(p => p.id === ownerId)
        );
        if (newChat) {
          setCurrentChat(newChat);
        }
        setCurrentSection('chat');
      }, 100);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentSection} />
            <Dashboard preview onSectionChange={setCurrentSection} />
          </>
        );
      case 'farm-health':
        return <FarmHealth />;
      case 'recommendations':
        return <Recommendations />;
      case 'market':
        return <MarketSection onNavigateToChat={handleNavigateToChat} />;
      case 'tools-lending':
        return <ToolsLending onNavigateToChat={handleNavigateToChat} />;
      case 'chat':
        return <ChatSystem />;
      case 'government-schemes':
        return <GovernmentSchemes />;
      case 'dashboard':
        return <Dashboard onSectionChange={setCurrentSection} />;
      case 'profile':
        return <Profile />;
      default:
        return <Hero onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        unreadNotifications={unreadCount}
        onNotificationClick={() => setIsNotificationPanelOpen(true)}
      />

      <main className="pt-16">
        {renderSection()}
      </main>

      <Footer onNavigate={setCurrentSection} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
      />

      <AIChatbot />

      {isAuthenticated && <UserSwitcher />}
    </div>
  );
}

export default App;
