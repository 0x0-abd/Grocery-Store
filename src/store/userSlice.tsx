import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    name: string | null;
    email: string | null;
    isAdmin: boolean;
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    isAdmin: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (_state, action: PayloadAction<UserState>) => action.payload,
      clearUser: (_state, _action: PayloadAction<UserState>) => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;