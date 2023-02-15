import { XMLParser } from "fast-xml-parser";
import { PRIVATE_KEY } from '@env';
export interface StationListDetail {
    LOCAL_X: number;
    LOCAL_Y: number;
    MOBI_NUM: number;
    STATION_ID: number;
    STATION_NM: string;
}

const getBusstationInformation = async () => {
    const parser = new XMLParser();
    return fetch(`http://openapi.changwon.go.kr/rest/bis/Station/?serviceKey=${PRIVATE_KEY}&`)
        .then((res) => res.text())
        .then((res) => parser.parse(res).ServiceResult.MsgBody.StationList.row)
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

export default { getBusstationInformation, getNearestStationByCurrentLocationFromStationList };
