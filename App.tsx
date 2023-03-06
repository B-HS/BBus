import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store/config";
import Body from "./Componenet/Body";
import Header from "./Componenet/Header";
import * as TaskManager from "expo-task-manager";
import { LocationObjectCoords } from "expo-location";
import BusLocationAction from "./store/action/BusLocationAction";
import { useEffect, useState } from "react";
import { eachBusLocationAndDetail, StationListDetail } from "./types/businfo";
const App = () => {
    const [currentStationInfo, setCurrentStationInfo] = useState<StationListDetail>();
    const [target, setTarget] = useState<{ name: string; list: eachBusLocationAndDetail[] }>({name:"", list:[]});
    TaskManager.defineTask("trackInfo", async ({ data, error }) => {
        const info = JSON.parse(JSON.stringify(data))["locations"][0].coords as LocationObjectCoords;
        const listInfo: StationListDetail[] = await BusLocationAction.getBusstationInformation();
        const nearestStationInfo: StationListDetail = await BusLocationAction.getNearestStationByCurrentLocationFromStationList(listInfo, info.longitude, info.latitude);
        setCurrentStationInfo(nearestStationInfo);
        const leftCount = target.list.length-target.list.findIndex(v=>v.STATION_NM=nearestStationInfo.STATION_NM)
        // 레프트카운트 찾았고, target.list = 총 길이, 
        // 위치가 갱신되면 target.list.findindex의 인덱스 부터 마지막까지의 배열을 표시
        // 만약에 경로에 없는 위치가 가까운 위치로오면 그건 직선거리상 더 가까운 정류장이니 무시처리하기
        // 그래서 위치 바뀔때마다 상태값 변경시면서 target.list길이와 finxIndex숫자가 같아지면 종료
        // 
        if (error) {
            console.log(error.message);
        }
    });

    useEffect(() => {
        console.log(currentStationInfo?.STATION_NM);
        console.log(target);
        
    }, [currentStationInfo, target]);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
                    <Header />
                    <Body target={setTarget}></Body>
                </SafeAreaView>
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 0,
    },
});

export default App;
