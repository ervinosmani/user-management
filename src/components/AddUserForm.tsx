import React, { useState } from "react";

type Props = {
    onAdd: (data: { name: string; email: string }) => void;
};

export default function AddUserForm({ onAdd }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        //Validim i thejshte (kerkon vlere per name dhe email)
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        //Kthe te dhenat lart
        onAdd({ name: name.trim(), email: email.trim() });
        setName("");
        setEmail("");
    }

    return (
        <form onSubmit={handleSubmit} style={{ margin: "12px 0" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div>
                    <input
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: 8, width: 220 }}
                    />
                    {errors.name && (
                        <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>
                    )}
                </div>

                <div>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: 8, width: 260 }}
                    />
                    {errors.email && (
                        <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>
                    )}
                </div>

                <button type="submit" style={{ padding: "8px 12px" }}>Add</button>
            </div>
        </form>
    )
}