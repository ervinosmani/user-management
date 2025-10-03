import { useEffect, useState } from "react";
import type { User } from "../types";
import { fetchUsers } from "../api/users";
import { Link } from "react-router-dom";

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div>
            <h2>Users</h2>

            <input 
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: 8, margin: "8px 0", width: 320, maxWidth: "100%" }}
            />

            <ul>
                {users.filter((u) => {
                    const q = query.toLowerCase().trim();
                    return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q)
                    );
                })
                .map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <strong>{u.name}</strong> - {u.email} - {u.company.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}