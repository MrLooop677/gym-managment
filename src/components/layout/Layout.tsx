import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [isSidebarOpen]);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/members", label: "Members", icon: "👥" },
    { path: "/subscriptions", label: "Subscriptions", icon: "📅" },
    { path: "/payments", label: "Payments", icon: "💰" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-64
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <span
            className={`text-xl font-bold ${
              isSidebarCollapsed ? "hidden" : ""
            }`}
          >
            اداره الصاله الرياضيه
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg
                transition-colors duration-200
                ${
                  location.pathname.startsWith(item.path)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
