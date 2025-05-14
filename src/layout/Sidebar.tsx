import React from "react";
import { Link, useLocation } from "react-router-dom";
import navigationConfig from "../config/navigationConfig";

interface SidebarProps {
  className?: string; // Allow className as an optional prop
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 ${className}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          ادارة الصالة الرياضية
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        {navigationConfig.map((item, index) => (
          <div key={index} className="mb-4">
            {item.children ? (
              <>
                <div className="mb-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.title}
                </div>
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    to={child.path}
                    className={`mb-2 flex items-center rounded-lg px-4 py-2 text-sm ${
                      isActiveLink(child.path)
                        ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {child.icon && <child.icon className="mr-3 h-5 w-5" />}
                    {child.title}
                  </Link>
                ))}
              </>
            ) : (
              <Link
                to={item.path}
                className={`mb-2 flex items-center rounded-lg px-4 py-2 text-sm ${
                  isActiveLink(item.path)
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
