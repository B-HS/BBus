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
        console.log(target.list.length-target.list.findIndex(v=>v.STATION_NM=nearestStationInfo.STATION_NM));
        
        


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
