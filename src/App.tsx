import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Layout from "./layout";
import MembersList from "./pages/members/MembersList";
import AddMember from "./pages/members/AddMember";
import MemberProfile from "./pages/members/MemberProfile";
import EditMember from "./pages/members/EditMember";
import Login from "./pages/auth/Login";

import "./styles/rtl.css";
import DailyIncome from "./pages/Dashboard/DailyIncome";
import Income from "./pages/income";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    // Add a class to body for additional RTL styling if needed
    document.body.classList.toggle("rtl", i18n.language === "ar");
  }, [i18n.language]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(authState);
      return authState;
    };

    // Check auth state on mount
    const initialAuthState = checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);

    // Cleanup event listener
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }: { children: JSX.Element }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="members">
            <Route index element={<MembersList />} />
            <Route path="add" element={<AddMember />} />
            <Route path="edit/:id" element={<EditMember />} />
            <Route path=":id" element={<MemberProfile />} />
          </Route>
          <Route path="daily-income" element={<Income />} />
        </Route>
      </Routes>
    </Router>
  );
}
