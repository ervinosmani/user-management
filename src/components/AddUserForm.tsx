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
        <form onSubmit={handleSubmit} className="my-3">
             <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                    <input
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-10 rounded-2xl bg-slate-800/60 border border-slate-700
                                   px-4 text-slate-200 placeholder-slate-400
                                   outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    {errors.name && (
                        <div className="text-rose-400 text-xs mt-1">{errors.name}</div>
                    )}
                </div>

                <div>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email"
                        className="w-full h-10 rounded-2xl bg-slate-800/60 border border-slate-700
                                   px-4 text-slate-200 placeholder-slate-400
                                   outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    {errors.email && (
                        <div className="text-rose-400 text-xs mt-1">{errors.email}</div>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="h-10 px-5 rounded-2xl bg-indigo-600 text-white
                               hover:bg-indigo-500 transition-colors
                               sm:self-stretch"
                >
                Add
            </button>
            </div>
        </form>
    )
}