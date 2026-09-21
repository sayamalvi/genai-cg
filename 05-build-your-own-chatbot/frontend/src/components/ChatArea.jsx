import React, { useEffect, useRef } from 'react';

const ChatArea = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div id="chat-container" className="flex-1 overflow-y-auto custom-scrollbar pb-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <i className="fa-solid fa-robot text-4xl mb-4 text-emerald-600/50"></i>
          <p className="text-lg">Start a conversation...</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`w-full transition-colors duration-200 ${
                isUser ? 'bg-chat-user' : 'hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="max-w-3xl mx-auto flex gap-4 px-4 py-6 md:px-6 md:py-8">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center shadow-sm text-sm ${
                    isUser
                      ? 'bg-blue-600 font-bold text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isUser ? 'SA' : <i className="fa-solid fa-robot"></i>}
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed w-full text-gray-200">
                  {msg.content.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className={isUser ? 'text-gray-100' : 'text-gray-200'}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatArea;
