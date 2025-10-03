import { useEffect, useState } from "react";
import type { User } from "../types";
import { fetchUsers } from "../api/users";
import { Link } from "react-router-dom";
import AddUserForm from "../components/AddUserForm";

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "email" | "company" | null>(null);

    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    function handleAdd(data: { name: string; email: string }) {
        const newUser: User = {
            id: -Date.now(),  //id lokal unik
            name: data.name.trim(),
            email: data.email.trim(),
            phone: "_",
            website: "_",
            address: { street: "_", suite: "_", city: "_", zipcode: "_" },
            company: { name: "_" },
        };
        setUsers(prev => [newUser, ...prev]);
    }

    const filtered = users.filter((u) => {
        const q = query.toLowerCase().trim();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

    if (sortBy) {
        filtered.sort((a, b) => {
            const A = (sortBy === "company" ? a.company.name : (a as any)[sortBy]).toLowerCase();
            const B = (sortBy === "company" ? b.company.name : (b as any)[sortBy]).toLowerCase();
            return A.localeCompare(B);
        });
    }

    return (
        <div>
            <h2>Users</h2>

            <input 
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: 8, margin: "8px 0", width: 320, maxWidth: "100%" }}
            />

            <AddUserForm onAdd={handleAdd} />

            <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
                <button onClick={() => setSortBy("name")}>Sort by Name</button>
                <button onClick={() => setSortBy("email")}>Sort by Email</button>
                <button onClick={() => setSortBy("company")}>Sort by Company</button>
                <button onClick={() => setSortBy(null)}>Clear</button>
            </div>

            {filtered.length === 0 ? (
                <p>No users found</p>
            ) : (
                <ul>
                {filtered.map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <strong>{u.name}</strong> - {u.email} - {u.company.name}
                        </Link>
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
}