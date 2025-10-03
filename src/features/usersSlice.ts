import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types"

type UsersState = {
    items: User[];
};

type UpdatePayload = { id: number; changes: Partial<User> };
type DeletePayLoad = { id: number };

const initialState: UsersState = {
    items: [],
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setAll(state, action: PayloadAction<User[]>) {
            state.items = action.payload;
        },
        addLocal(state, action: PayloadAction<User>) {
            state.items = [action.payload, ...state.items];
        },
        updateLocal(state, action: PayloadAction<UpdatePayload>) {
            const { id, changes } = action.payload;
            const i = state.items.findIndex(u => u.id === id);
            if (i !== -1) state.items[i] = { ...state.items[i], ...changes };
        },
        deleteLocal(state, action: PayloadAction<DeletePayLoad>) {
            state.items = state.items.filter(u => u.id !== action.payload.id);
        },
    },
});

export const { setAll, addLocal, updateLocal, deleteLocal } = usersSlice.actions;
export default usersSlice.reducer;