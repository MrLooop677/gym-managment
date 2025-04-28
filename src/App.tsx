import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import DailyIncome from "./pages/Dashboard/DailyIncome";
import Layout from "./layout";
import MembersList from "./pages/members/MembersList";
import AddMember from "./pages/members/AddMember";
import MemberProfile from "./pages/members/MemberProfile";
import EditMember from "./pages/members/EditMember";

import './styles/rtl.css';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    // Add a class to body for additional RTL styling if needed
    document.body.classList.toggle('rtl', i18n.language === 'ar');
  }, [i18n.language]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="members">
            <Route index element={<MembersList />} />
            <Route path="add" element={<AddMember />} />
            <Route path="edit/:id" element={<EditMember />} />
            <Route path=":id" element={<MemberProfile />} />
          </Route>
          <Route path="daily-income" element={<DailyIncome />} />
        </Route>
      </Routes>
    </Router>
  );
}
