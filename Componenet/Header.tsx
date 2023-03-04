import { AntDesign, Feather, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Animated, AppState, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-ui-lib";
import BusLocation from "../store/action/BusLocationAction";
import { useAppDispatch, useAppSelector } from "../store/config";
import { setBusList, setLoading } from "../store/slice/busSlice";
import { RefectoredBusInfo, StationArriveDetail, StationListDetail } from "../types/businfo";

const Header = () => {
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [listLoading, setListLoading] = useState<boolean>(false);
    const [currentLocation, setCurrentLocation] = useState<string>("현재위치");
    const [busInfoList, setBusInfoList] = useState<RefectoredBusInfo[]>([]);
    const [busArriveInfo, setBusArriveInfo] = useState<StationArriveDetail[]>([]);
    const [busStationInfo, setBusStationInfo] = useState<StationListDetail[]>([]);
    const [currentStationInfo, setCurrentStationInfo] = useState<StationListDetail>();
    const [background, setBacground] = useState<boolean>(false);
    const [bLocating, setBLocating] = useState<boolean>(false);
    const spinValue = useRef(new Animated.Value(0)).current;
    const busSlice = useAppSelector((state) => state.busSlice);
    const dispatch = useAppDispatch();
    const requestPermissions = async () => {
        if (!busSlice.loading) {
            dispatch(setLoading(true));
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
        }
    };
    const [time, setTime] = useState<string>("0");
    TaskManager.defineTask("backTracking", ({ data, error }) => {
        console.log(time);

        if (!bLocating) {
            Location.getCurrentPositionAsync().then(async (loc) => {
                const nearestStationInfo: StationListDetail = await BusLocation.getNearestStationByCurrentLocationFromStationList(busStationInfo, loc?.coords.longitude, loc?.coords.latitude);
                setCurrentLocation(nearestStationInfo.STATION_NM);
                setCurrentStationInfo(nearestStationInfo);
                console.log("=========================");
                console.log(currentLocation);
                console.log(currentStationInfo);
                console.log("=========================");
            });
        }
        if (error) {
            console.log(error.message);
            return;
        }
    });

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "720deg"],
    });

    const setBusUIInfo = async () => {
        const result = await BusLocation.completeUIArriveInfo(busArriveInfo, busInfoList, busStationInfo);
        dispatch(setBusList(result));
    };

    const getBusArriveInfo = async () => {
        if (currentStationInfo && currentStationInfo.STATION_ID > 0) {
            const info = await BusLocation.getBusArriveInfoByStationId(currentStationInfo.STATION_ID);
            setBusArriveInfo(() => info);
        }
    };

    const getBusInfoList = async () => {
        const info = await BusLocation.getBusInfoList();
        setBusInfoList(() => [...info]);
    };

    const getBusStationInfo = async () => {
        dispatch(setLoading(true));
        spinValue.resetAnimation();
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
        if (!background) {
            getBusStationInfo();
            getBusInfoList();
        }
    }, []);

    useEffect(() => {
        if (!background) {
            requestPermissions().then((res) => {
                getLocation(res);
            });
        }
    }, [busStationInfo]);

    useEffect(() => {
        if (!background) {
            getBusArriveInfo();
        }
    }, [currentStationInfo]);

    useEffect(() => {
        if (!listLoading && !background) {
            setListLoading(true);
            setBusUIInfo().then(() => {
                dispatch(setLoading(false));
                setListLoading(false);
                spinValue.stopAnimation();
            });
        }
    }, [busArriveInfo]);

    useEffect(() => {
        console.log(AppState.currentState);
        AppState.addEventListener("change", () => {
            if (AppState.currentState === "background") {
                setBacground(true);
                let time = new Date();
                setTime(time.toISOString());
                Location.startLocationUpdatesAsync("backTracking", { showsBackgroundLocationIndicator: true, deferredUpdatesTimeout:10000 });
            }
            if (AppState.currentState === "active") {
                setBacground(false);
                Location.stopLocationUpdatesAsync("backTracking");
            }
        });
    }, []);
    return (
        <View style={styles.header}>
            <SimpleLineIcons name="menu" size={24} color="black" style={{ width: "30%", borderColor: "black" }} />
            <View style={styles.locationSection}>
                <Text style={styles.targetLoacation}>
                    {currentLocation}
                    {busStationInfo.length == 0 && "로딩 중"}
                </Text>
                <AntDesign name="caretdown" size={12} color="gray" />
            </View>
            <View style={styles.iconSection}>
                <TouchableOpacity
                    onPress={() => {
                        requestPermissions().then((res) => getLocation(res));
                    }}
                >
                    <MaterialCommunityIcons name="map-marker-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => getBusStationInfo()} style={{ marginLeft: 10 }}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Feather name="refresh-cw" size={18} color={`${busSlice.loading ? "blue" : "black"}`} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
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
        paddingLeft: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "40%",
    },
    iconSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "30%",
    },
});

export default Header;
