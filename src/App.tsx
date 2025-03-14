import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Layout from "./layout";
import MembersList from "./pages/members/MembersList";
import AddMember from "./pages/members/AddMember";
import MemberProfile from "./pages/members/MemberProfile";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="members">
            <Route index element={<MembersList />} />
            <Route path="add" element={<AddMember />} />
            <Route path=":id" element={<MemberProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
