import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { eachBusLocationAndDetail, StationListDetail, UIArriveInfoText } from "../../types/businfo";

interface busInfo {
    busList: UIArriveInfoText[];
    targetLocation: string;
    currentLocation?: string;
    stationListDuringTracking?: eachBusLocationAndDetail[];
    loading?: boolean;
    busStationInfo : StationListDetail[]
}

const initialState: busInfo = {
    busList: [],
    loading: false,
    stationListDuringTracking: [],
    targetLocation: "",
    currentLocation: "",
    busStationInfo: []
};

export const busSlice = createSlice({
    name: "bus",
    initialState,
    reducers: {
        setBusList: (state, action: PayloadAction<UIArriveInfoText[]>) => {
            state.busList = [...action.payload];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setTargetLocationInfo: (state, action: PayloadAction<eachBusLocationAndDetail | null>) => {
            if (action.payload) {
                state.targetLocation = action.payload.STATION_NM;
                state.stationListDuringTracking = JSON.parse(JSON.stringify(action.payload));
            }
            if (!action.payload) {
                state.targetLocation = "";
                state.stationListDuringTracking = [];
            }
        },

        setTrackingCurrentLocation: (state, action: PayloadAction<string>) => {
            state.currentLocation = action.payload;
        },

        setFullBusStationInfo : (state, action: PayloadAction<StationListDetail[]>)=>{
            state.busStationInfo = JSON.parse(JSON.stringify(action.payload));
        }
    },
});
export const { setBusList, setLoading, setTargetLocationInfo, setTrackingCurrentLocation, setFullBusStationInfo } = busSlice.actions;
export default busSlice.reducer;
