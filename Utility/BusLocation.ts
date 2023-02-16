import { XMLParser } from "fast-xml-parser";
import { PRIVATE_KEY } from "@env";
export interface StationListDetail {
    LOCAL_X: number;
    LOCAL_Y: number;
    MOBI_NUM: number;
    STATION_ID: number;
    STATION_NM: string;
}

export interface StationArriveDetail{
    ARRV_VH_ID: number
    CALC_DATE: Date
    LEFT_STATION: number
    PREDICT_TRAV_TM: number
    ROUTE_ID: number
    STATION_ORD: number
    UPDN_DIR: number
}

const parser = new XMLParser();

const getBusstationInformation = async () => {
    return fetch(`http://openapi.changwon.go.kr/rest/bis/Station/?serviceKey=${PRIVATE_KEY}&`)
        .then((res) => res.text())
        .then((res) => parser.parse(res).ServiceResult.MsgBody.StationList.row)
        .then((res) => {
            let newJsonObj: any[] = [];
            newJsonObj.push(JSON.parse(JSON.stringify(res)));
            return JSON.parse(JSON.stringify(newJsonObj[0]));
        });
};

const getBusInfoList = async ()=>{
    return fetch(`http://openapi.changwon.go.kr/rest/bis/Bus/?serviceKey=${PRIVATE_KEY}&`)
    .then((res) => res.text())
    .then((res)=>parser.parse(res).ServiceResult.MsgBody.BusList.row)
    .then((res) => {
        let newJsonObj: any[] = [];
        newJsonObj.push(JSON.parse(JSON.stringify(res)));
        return JSON.parse(JSON.stringify(newJsonObj[0]));
    });
}

const getBusArriveInfoByStationId = async (stationId: number) => {
    return fetch(`http://openapi.changwon.go.kr/rest/bis/BusArrives/?serviceKey=APIKEY대기중&station=${stationId}`)
        .then((res) => res.text())
        .then(async (res) => parser.parse(res).ServiceResult.MsgBody.ArriveInfoList.row)
        .then((res) => {
            let newJsonObj: any[] = [];
            newJsonObj.push(JSON.parse(JSON.stringify(res)));
            return JSON.parse(JSON.stringify(newJsonObj[0]));
        });
};

const getNearestStationByCurrentLocationFromStationList = async (list: StationListDetail[], currentX: number, currentY: number) => {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let resultLocation = {};

    for (const iterator of list) {
        const distance = Math.sqrt(2 * Math.abs(iterator.LOCAL_X - currentX) + 2 * Math.abs(iterator.LOCAL_Y - currentY));
        if (distance < minDistance) {
            minDistance = distance;
            resultLocation = JSON.parse(JSON.stringify(iterator));
        }
    }
    return resultLocation as StationListDetail;
};

export default { getBusstationInformation, getNearestStationByCurrentLocationFromStationList, getBusArriveInfoByStationId, getBusInfoList };
