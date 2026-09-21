import React from 'react';

const Sidebar = ({ isMobileOpen, closeSidebar }) => {
  return (
    <>
      <aside
        className={`bg-chat-sidebar w-64 flex-shrink-0 border-r border-chat-border flex flex-col transition-transform duration-300 md:relative absolute z-20 h-full ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* New Chat Button & Mobile Close */}
        <div className="p-3 flex items-center justify-between">
          <button className="flex items-center gap-2 w-full hover:bg-chat-user p-2 rounded-md transition-colors text-sm font-medium border border-chat-border text-gray-200">
            <i className="fa-solid fa-plus"></i> New chat
          </button>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 ml-2 text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Spacer to push user profile to bottom */}
        <div className="flex-1"></div>

        {/* User Profile (Bottom) */}
        <div className="p-3 border-t border-chat-border">
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-chat-user transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
              SA
            </div>
            <div className="text-sm font-semibold text-gray-200">Sayam Alvi</div>
          </a>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isMobileOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-10 md:hidden transition-opacity"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
