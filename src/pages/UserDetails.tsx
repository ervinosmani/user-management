import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { User } from "../types";
import { fetchUserById } from "../api/users";

export default function UserDetails() {
    const { id } = useParams(); //merr id nga URL
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchUserById(id)
            .then(setUser)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 max-w-2xl">
            <h2 className="text-xl font-semibold text-slate-100">{user.name}</h2>

            <p className="mt-3 text-slate-300"><strong className="text-slate-200">Phone:</strong> {user.phone}</p>
            <p className="mt-2 text-slate-300">
                <strong className="text-slate-200">Website:</strong>{" "}
                {user.website && user.website !== "_" ? (
                    <a href={`http://${user.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
                        {user.website}
                    </a>
                ) : (
                  "_"
                )}
            </p>

            <div className="mt-4">
                <strong className="text-slate-200 font-medium">Address:</strong>
                <div className="text-slate-300">{user.address.street}, {user.address.suite}</div>
                <div className="text-slate-300">{user.address.city}, {user.address.zipcode}</div>
            </div>

            <div className="mt-6">
                <Link 
                    to="/" 
                    className="inline-flex items-center rounded-2xl bg-slate-800/70 px-4 py-2
                               text-slate-200 hover:bg-slate-700/70 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full sm:w-auto"
                >
                    Back
                </Link>
            </div>
        </div>
    )
}