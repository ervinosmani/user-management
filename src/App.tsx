import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <header style={{ marginBottom: 16 }}>
        <Link to="/" style={{ fontWeight: 600, fontSize: 22, textDecoration: "none" }}>
          User Management
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </div>
  );
}