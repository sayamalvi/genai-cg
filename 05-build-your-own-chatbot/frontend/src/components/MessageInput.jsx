import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      if (input.trim() === '') {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = input.trim() === '' || isLoading;

  return (
    <div className="w-full pt-2 pb-4 md:pb-6 px-4 md:px-6 bg-chat-bg border-t border-transparent relative z-0">
      <div className="max-w-3xl mx-auto relative">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end shadow-lg rounded-xl bg-chat-user border border-chat-border focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 transition-shadow"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            className="w-full bg-transparent text-gray-100 rounded-xl pl-4 pr-12 py-3 md:py-4 focus:outline-none resize-none max-h-[200px] custom-scrollbar text-sm md:text-base leading-relaxed disabled:opacity-50"
            placeholder="Message ChatBot..."
          />

          <button
            type="submit"
            disabled={isDisabled}
            className={`absolute right-2 bottom-2 md:bottom-2.5 p-2 rounded-lg transition-colors flex items-center justify-center h-8 w-8 md:h-9 md:w-9 ${
              isDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-sm"></i>
            ) : (
              <i className="fa-solid fa-arrow-up text-sm"></i>
            )}
          </button>
        </form>
        <div className="text-xs text-center text-gray-400 mt-3 md:mt-4 mb-2">
          ChatBot can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
