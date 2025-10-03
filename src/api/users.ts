import type { User } from "../types";

export async function fetchUsers(): Promise<User[]> {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) {
        throw new Error("failed to fetch users");
    }
    return res.json();
}

export async function fetchUserById(id: string | number): Promise<User> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    return res.json();
}