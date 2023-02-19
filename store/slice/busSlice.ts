import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { UIArriveInfoText } from "../../types/businfo";

interface busInfo {
    busList: UIArriveInfoText[];
    loading: boolean;
}

const initialState: busInfo = {
    busList: [],
    loading: false,
};

export const busSlice = createSlice({
    name: "bus",
    initialState,
    reducers: {
        setBusList: (state, action: PayloadAction<UIArriveInfoText[]>) => {
            state.busList = [...action.payload];
        },
    },
});
export const { setBusList } = busSlice.actions;
export default busSlice.reducer;
