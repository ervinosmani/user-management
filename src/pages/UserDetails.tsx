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
        <div>
            <h2>{user.name}</h2>

            <p><strong>Phone:</strong> {user.phone}</p>
            <p>
                <strong>Website:</strong>{" "}
                {user.website && user.website !== "_" ? (
                    <a href={`http://${user.website}`} target="_blank" rel="noreferrer">
                        {user.website}
                    </a>
                ) : (
                  "_"
                )}
            </p>

            <div style={{ marginTop: 8 }}>
                <strong>Address:</strong>
                <div>{user.address.street}, {user.address.suite}</div>
                <div>{user.address.city}, {user.address.zipcode}</div>
            </div>

            <div style={{ marginTop: 16 }}>
                <Link to="/">Back</Link>
            </div>
        </div>
    )
}