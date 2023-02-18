import { XMLParser } from "fast-xml-parser";
import { PRIVATE_KEY } from "@env";
import { BusInfo, RefectoredBusInfo, StationArriveDetail, StationListDetail, UIArriveInfoText } from "../../types/busifno";
const parser = new XMLParser();
const completeUIArriveInfo = (arriveInfo: StationArriveDetail[], refectoredBusinfo: RefectoredBusInfo[], stationInfo: StationListDetail[]) => {
    const actualArrivingBusList: StationArriveDetail[] = arriveInfo.filter((v) => v.ARRV_VH_ID !== 0);
    const resultInfo: UIArriveInfoText[] = [];
    for (const arvList of actualArrivingBusList) {
        refectoredBusinfo
            .filter((info) => info.busRouterId == arvList.ROUTE_ID)
            .forEach((v) => {
                resultInfo.push({
                    name: v.busNumber,
                    leftCount: arvList.LEFT_STATION,
                    endLocation: stationInfo.filter((loc) => loc.STATION_ID == v.lastStationNumber)[0].STATION_NM,
                    currentLocation: "보류",
                    leftTime: Math.round(arvList.PREDICT_TRAV_TM / 60),
                });
            });
    }

    console.log("========================================");
    resultInfo.forEach((v) => console.log(v));
    // actualArrivingBusList.forEach(v=>console.log(v))
    // stationInfo.forEach(v=>console.log(v))
    console.log("========================================");
    return resultInfo
};

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

const getBusInfoList = async () => {
    return fetch(`http://openapi.changwon.go.kr/rest/bis/Bus/?serviceKey=${PRIVATE_KEY}&`)
        .then((res) => res.text())
        .then((res) => parser.parse(res).ServiceResult.MsgBody.BusList.row)
        .then((res) => {
            let newJsonObj: RefectoredBusInfo[] = [];
            res.forEach((val: BusInfo) => {
                newJsonObj.push(
                    JSON.parse(
                        JSON.stringify({
                            busNumber: val.ROUTE_NM,
                            busRouterId: val.ROUTE_ID,
                            startTime: val.FIRST_TM,
                            endTime: val.LAST_TM,
                            govName: val.GOV_NM,
                            startStationNumber: val.DST_STATION_ID,
                            lastStationNumber: val.ORGT_STATION_ID,
                        })
                    )
                );
            });

            return [...newJsonObj];
        });
};

const getBusArriveInfoByStationId = async (stationId: number) => {
    return fetch(`http://openapi.changwon.go.kr/rest/bis/BusArrives/?serviceKey=${PRIVATE_KEY}&station=${stationId}`)
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

export default { getBusstationInformation, getNearestStationByCurrentLocationFromStationList, getBusArriveInfoByStationId, getBusInfoList, completeUIArriveInfo };
