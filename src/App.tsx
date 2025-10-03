import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto p-4 sm:p-6 max-w-3xl lg:max-w-4xl">
        <header className="mb-6 text-center">
          <Link to="/" className="text-2xl font-semibold text-slate-100">
            User Management
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </div>
    </div>
  );
}