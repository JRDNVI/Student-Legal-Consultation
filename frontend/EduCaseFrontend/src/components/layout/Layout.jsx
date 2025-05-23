import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaSignOutAlt, FaBell, FaEnvelope, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import MessagePanel from "../messaging/messagePanel";
import SidePanel from "../messaging/Sidepanel";
import { items, pathMap } from "../../util/appMapping";

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user["custom:role"];
  const { unread, markAsRead } = useSocket();
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [collapsed, setCollapsed] = useState(false);


  const navItems = items[role] || [];
  const currentPath = location.pathname;
  const pageTitle = pathMap[currentPath] || "My App";

  const handleOpenMessagePanel = () => {
    setShowMessagePanel(true);
    Object.keys(unread).forEach((email) => {
      if (unread[email]) markAsRead(email);
    });
  };

  return (
    <div className="flex h-screen">
      <aside className={`${collapsed ? "w-16" : "w-48"} bg-white shadow-md h-screen p-4 flex flex-col justify-between transition-all duration-300`}>
        <div>
          {!collapsed && (
            <h2 className="text-2xl font-bold mb-10 capitalize">{role} Dashboard</h2>
          )}
          <nav className="flex flex-col gap-4">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${isActive ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:text-purple-600"
                    }`}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-4 mt-auto">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-purple-600 transition"
          >
            {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
        </div>


      </aside>

      <div className="flex flex-col flex-1">
        <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <FaBell className="text-xl text-gray-700" />
            </div>
            <div className="relative cursor-pointer" onClick={handleOpenMessagePanel}>
              <FaEnvelope className="text-xl text-gray-700" />
              {Object.values(unread).some(Boolean) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </div>
            <SidePanel
              isOpen={showMessagePanel}
              onClose={() => setShowMessagePanel(false)}
              title="Messages"
            >
              <MessagePanel onClose={() => setShowMessagePanel(false)} />
            </SidePanel>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 bg-gray-50">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
