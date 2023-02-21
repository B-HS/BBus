import { PRIVATE_KEY } from "@env";
import { XMLParser } from "fast-xml-parser";
import { BusInfo, eachBusLocationAndDetail, RefectoredBusInfo, StationArriveDetail, StationListDetail, UIArriveInfoText } from "../../types/businfo";
const parser = new XMLParser();
const completeUIArriveInfo = async (arriveInfo: StationArriveDetail[], refectoredBusinfo: RefectoredBusInfo[], busStationInfo: StationListDetail[]) => {
    if (arriveInfo.length == 0 || refectoredBusinfo.length == 0 || busStationInfo.length == 0) {
        return [];
    }

    let actualArrivingBusList: StationArriveDetail[] = arriveInfo
        .filter((v) => v.ARRV_VH_ID !== 0)
        .reduce((acc: StationArriveDetail[], current) => {
            if (acc.findIndex(({ ARRV_VH_ID }) => ARRV_VH_ID === current.ARRV_VH_ID) === -1) {
                acc.push(current);
            }
            return acc;
        }, []);
    const resultInfo: UIArriveInfoText[] = [];
    console.log("start");
    for (const arvList of actualArrivingBusList) {
        let endPoint = "";
        const tmpCurrentLocation: eachBusLocationAndDetail[] = await getBusLocationDetail(arvList.ROUTE_ID);
        const currentLocation = tmpCurrentLocation.filter((v: eachBusLocationAndDetail) => {
            if (v.TUR === "T") {
                if (arvList.UPDN_DIR == 0) {
                    endPoint = v.STATION_NM;
                } else {
                    endPoint = tmpCurrentLocation[0].STATION_NM
                }
            }
            if (v.EVENT_CD != null && v.STATION_ORD == arvList.STATION_ORD - arvList.LEFT_STATION) {
                return v;
            }
        })[0].STATION_NM;
        refectoredBusinfo
            .filter((info) => info.busRouterId == arvList.ROUTE_ID)
            .forEach(async (v) => {
                resultInfo.push({
                    name: v.busNumber,
                    leftCount: arvList.LEFT_STATION,
                    endLocation: endPoint,
                    currentLocation: currentLocation,
                    leftTime: Math.round(arvList.PREDICT_TRAV_TM / 60),
                    keyword: tmpCurrentLocation.map(v=>v.STATION_NM)
                });
            });
    }
    console.log("end");
    return resultInfo
        .sort(function (a, b) {
            return (a.name as number) - (b.name as number);
        })
        .sort(function (a, b) {
            return a.leftTime - b.leftTime;
        });
};

const getBusstationInformation = async () => {
    return await fetch(`http://openapi.changwon.go.kr/rest/bis/Station/?serviceKey=${PRIVATE_KEY}&`)
        .then((res) => res.text())
        .then((res) => parser.parse(res).ServiceResult.MsgBody.StationList.row)
        .then((res) => {
            let newJsonObj: StationListDetail[] = [];
            newJsonObj.push(JSON.parse(JSON.stringify(res)));
            return JSON.parse(JSON.stringify(newJsonObj[0])) as StationListDetail[];
        });
};

const getBusInfoList = async () => {
    // const info: busDetailInfo[] = await fetch(`http://openapi.changwon.go.kr/rest/bis/BusInfo/?serviceKey=${PRIVATE_KEY}`)
    //     .then((res) => res.text())
    //     .then((res) => parser.parse(res).ServiceResult.MsgBody.BusInfoList.row);
    return await fetch(`http://openapi.changwon.go.kr/rest/bis/Bus/?serviceKey=${PRIVATE_KEY}&`)
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

const getBusPosition = async (routeId: number) => {
    return await fetch(`http://openapi.changwon.go.kr/rest/bis/BusPosition/?serviceKey=${PRIVATE_KEY}&route=${routeId}`)
        .then((res) => res.text())
        .then(async (res) => parser.parse(res).ServiceResult.MsgBody.BusPositionList.row)
        .then((res) => {
            let newJsonObj: any[] = [];
            newJsonObj.push(JSON.parse(JSON.stringify(res)));
            return JSON.parse(JSON.stringify(newJsonObj[0]));
        });
};

const getBusLocationDetail = async (routeId: number) => {
    return await fetch(`http://openapi.changwon.go.kr/rest/bis/BusLocation/?serviceKey=${PRIVATE_KEY}&route=${routeId}`)
        .then((res) => res.text())
        .then(async (res) => parser.parse(res).ServiceResult.MsgBody.BusLocationList.row)
        .then((res) => {
            let newJsonObj: any[] = [];
            newJsonObj.push(JSON.parse(JSON.stringify(res)));
            return JSON.parse(JSON.stringify(newJsonObj[0]));
        });
};

const getBusArriveInfoByStationId = async (stationId: number) => {
    return await fetch(`http://openapi.changwon.go.kr/rest/bis/BusArrives/?serviceKey=${PRIVATE_KEY}&station=${stationId}`)
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

export default { getBusstationInformation, getNearestStationByCurrentLocationFromStationList, getBusArriveInfoByStationId, getBusInfoList, completeUIArriveInfo, getBusPosition, getBusLocationDetail };
