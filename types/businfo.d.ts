export interface StationListDetail {
    LOCAL_X: number;
    LOCAL_Y: number;
    MOBI_NUM: number;
    STATION_ID: number;
    STATION_NM: string;
}

export interface StationArriveDetail {
    ARRV_VH_ID: number;
    CALC_DATE: Date;
    LEFT_STATION: number;
    PREDICT_TRAV_TM: number;
    ROUTE_ID: number;
    STATION_ORD: number;
    UPDN_DIR: number;
}

export interface RefectoredBusInfo {
    busNumber: number;
    busRouterId: number;
    startTime: string;
    endTime: string;
    govName: string;
    lastStationNumber: number;
    startStationNumber: number;
    upStationName: string;
    downStationName: string;
}

export interface BusInfo {
    ROUTE_ID: number;
    ROUTE_NM: number;
    ORGT_STATION_ID: number;
    DST_STATION_ID: number;
    ROUTE_NUM: number;
    ROUTE_TP: number;
    STATION_CNT: number;
    ROUTE_LEN: number;
    ROUTE_COLOR: number;
    FIRST_TM: string;
    LAST_TM: string;
    GOV_NM: string;
    UPD: string;
}

export interface UIArriveInfoText {
    name: number | string;
    leftTime: number;
    leftCount: number;
    currentLocation: string;
    endLocation: string;
}

export interface busDetailInfo {
    ROUTE_ID: number;
    ROUTE_NM: string;
    UP_DST_NM: string;
    DN_DST_NM: string;
    N_UFT: string;
    N_ULT: string;
    N_DFT: string;
    N_DLT: string;
    N_MIN: string;
    N_MAX: string;
    H_UFT: string;
    H_ULT: string;
    H_DFT: string;
    H_DLT: string;
    H_MIN: string;
    H_MAX: string;
}
