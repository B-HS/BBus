import { AntDesign, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-ui-lib";
import BusLocation, { StationListDetail, StationArriveDetail } from "../Utility/BusLocation";

export interface UIArriveInfoText{
    busNum: number;
    

}

const Header = () => {
    const [busInfoList, setBusInfoList] = useState<any[]>([]);
    const [busArriveInfo, setBusArriveInfo] = useState<StationArriveDetail[]>([]);
    const [busStationInfo, setBusStationInfo] = useState<StationListDetail[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [currentLocation, setCurrentLocation] = useState<string>("현재위치");
    const [currentStationInfo, setCurrentStationInfo] = useState<StationListDetail>();
    const [currentUIArriveInfoText, setCurrentUIArriveInfoText] = useState();
    const requestPermissions = async () => {
        let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
            setErrorMsg("location denied");
        } else {
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus === "granted") {
                return Location.getCurrentPositionAsync();
            } else {
                setErrorMsg("background denied");
                return;
            }
        }
    };

    const getBusArriveInfo = async () => {
        if (currentStationInfo && currentStationInfo.STATION_ID>0) {
            const info = await BusLocation.getBusArriveInfoByStationId(currentStationInfo.STATION_ID);
            setBusArriveInfo(()=>[...info])
        }
    };

    const getBusInfoList = async () =>{
        const info = await BusLocation.getBusInfoList()
        setBusInfoList(()=>[...info])
    }

    const getBusStationInfo = async () => {
        const info: StationListDetail[] = await BusLocation.getBusstationInformation();
        setBusStationInfo(() => [...info]);
    };

    const getLocation = async (loc?: LocationObject) => {
        if (errorMsg.length > 0) {
        } else {
            if ((loc?.coords.latitude, loc?.coords.longitude)) {
                const nearestStationInfo: StationListDetail = await BusLocation.getNearestStationByCurrentLocationFromStationList(busStationInfo, loc?.coords.longitude, loc?.coords.latitude);
                setCurrentLocation(nearestStationInfo.STATION_NM);
                setCurrentStationInfo(nearestStationInfo);
            }
        }
    };
    useEffect(() => {
        getBusStationInfo();
        getBusInfoList()
    }, []);

    useEffect(() => {
        requestPermissions().then((res) => {
            getLocation(res);
        });
    }, [busStationInfo]);

    useEffect(() => {
        getBusArriveInfo();
    }, [currentStationInfo]);

    useEffect(()=>{
        // console.log(busArriveInfo);
        console.log(busInfoList);
        
    },[busArriveInfo, busInfoList])
    
    return (
        <View style={styles.header}>
            <SimpleLineIcons name="menu" size={24} color="black" />
            <View style={styles.locationSection}>
                <Text style={styles.targetLoacation}>
                    {currentLocation}
                    {busStationInfo.length == 0 && "로딩 중"}
                </Text>
                <AntDesign name="caretdown" size={12} color="gray" />
            </View>
            <TouchableOpacity
                onPress={() => {
                    requestPermissions().then((res) => getLocation(res));
                }}
            >
                <MaterialCommunityIcons name="map-marker-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    targetLoacation: {
        marginRight: 5,
        fontSize: 20,
    },
    locationSection: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default Header;
