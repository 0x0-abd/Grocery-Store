import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferenceState {
    showProductTypes: string;
}

const initialState: PreferenceState = {
    showProductTypes:"all",
}

const preferenceSlice = createSlice({
    name: 'preference',
    initialState,
    reducers: {
      setProductType: (state, action: PayloadAction<string>) => {
        state.showProductTypes=action.payload
    },
    },
});

export const { setProductType } = preferenceSlice.actions;
export default preferenceSlice.reducer;