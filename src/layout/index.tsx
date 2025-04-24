import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar className="hidden md:block" />
      <div className="md:hidden">
        {/* Mobile Menu Component */}
        <MobileMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <Header />
          <LanguageSwitcher />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
