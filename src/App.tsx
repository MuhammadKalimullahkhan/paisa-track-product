import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CustomerDirectory from "./pages/CustomerDirectory";
import OrderDirectory from "./pages/OrderDirectory";
import NewTransaction from "./pages/NewTransaction";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerDirectory />} />
          <Route path="/orders" element={<OrderDirectory />} />
          <Route path="/new" element={<NewTransaction />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
