import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content) => {
    // 1. Add User Message
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 2. Call the backend API
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from server');
      }

      const data = await response.json();
      
      // 3. Add Bot Response
      setMessages((prev) => [...prev, { role: 'bot', content: data.message }]);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, I encountered an error communicating with the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-chat-bg text-white">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        closeSidebar={() => setIsMobileOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col relative w-full h-full">
        {/* Mobile Header */}
        <header className="h-14 flex items-center border-b border-chat-border px-4 md:hidden bg-chat-bg flex-shrink-0">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <h1 className="mx-auto font-semibold text-gray-200">New chat</h1>
        </header>

        <ChatArea messages={messages} isLoading={isLoading} />
        
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
