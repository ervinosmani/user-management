import { useEffect, useState } from "react";
import type { User } from "../types";
import { fetchUsers } from "../api/users";
import { Link } from "react-router-dom";
import AddUserForm from "../components/AddUserForm";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addLocal, deleteLocal, setAll, updateLocal } from "../features/usersSlice";

export default function Home() {
    const users = useAppSelector((s) => s.users.items);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "email" | "company" | null>(null);
    const PAGE_SIZE = 5;
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchUsers()
            .then((data) => dispatch(setAll(data)))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        setPage(1);
    }, [query, sortBy, users.length]);

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
        dispatch(addLocal(newUser));
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

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = filtered.slice(start, end);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
            {/* <h2 className="text-xl font-medium text-slate-100 text-center">Users</h2> */}

            <input
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 rounded-2xl bg-slate-800/60 border border-slate-700
                           px-4 text-slate-200 placeholder-slate-400
                           outline-none focus:ring-2 focus:ring-indigo-500/30"
            />

            <AddUserForm onAdd={handleAdd} />

            <div className="flex flex-wrap gap-2 my-4">
                <button
                    onClick={() => setSortBy("name")}
                    aria-pressed={sortBy === "name"}
                    className={`px-4 py-2 rounded-xl text-sm transition
                        ${sortBy === "name"
                            ? "bg-indigo-600 text-white shadow-[0_0_0_2px] shadow-indigo-500/30"
                            : "border border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800"}`}
                >
                    Sort by Name
                </button>

                <button
                    onClick={() => setSortBy("email")}
                    aria-pressed={sortBy === "email"}
                    className={`px-4 py-2 rounded-xl text-sm transition
                        ${sortBy === "email"
                            ? "bg-indigo-600 text-white shadow-[0_0_0_2px] shadow-indigo-500/30"
                            : "border border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800"}`}
                >
                    Sort by Email
                </button>

                <button
                    onClick={() => setSortBy("company")}
                    aria-pressed={sortBy === "company"}
                    className={`px-4 py-2 rounded-xl text-sm transition
                        ${sortBy === "company"
                            ? "bg-indigo-600 text-white shadow-[0_0_0_2px] shadow-indigo-500/30"
                            : "border border-slate-800 bg-slate-800/60 text-slate-200 hover:bg-slate-800"}`}
                >
                    Sort by Company
                </button>

                <button
                    onClick={() => setSortBy(null)}
                    aria-pressed={sortBy === null}
                    className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                >
                    Clear
                </button>
            </div>

            {filtered.length === 0 ? (
                <p>No users found</p>
            ) : (
                <ul className="space-y-2">
                    {pageItems.map((u) => (
                        <li
                            key={u.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800/40 px-4 py-3"
                        >
                            <Link
                                to={`/users/${u.id}`}
                                className="flex-1 text-slate-200 hover:text-slate-50"
                            >
                                <strong className="font-semibold">{u.name}</strong> — {u.email} — {u.company.name}
                            </Link>

                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1.5 text-sm rounded-lg border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newName = prompt("New name:", u.name)?.trim();
                                        const newEmail = prompt("New email:", u.email)?.trim();

                                        const changes: Partial<User> = {};
                                        if (newName && newName !== u.name) changes.name = newName;
                                        if (newEmail && newEmail !== u.email) changes.email = newEmail;

                                        if (Object.keys(changes).length > 0) {
                                            dispatch(updateLocal({ id: u.id, changes }));
                                        }
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="px-3 py-1.5 text-sm rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (confirm("Delete this user?")) {
                                            dispatch(deleteLocal({ id: u.id }));
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                    Showing <span className="text-slate-200">{Math.min(end, totalItems)}</span> of <span className="text-slate-200">{totalItems}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                        .map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1.5 rounded-md ${p === page ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                    <button
                        className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}