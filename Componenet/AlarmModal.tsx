import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Modal, Text, View } from "react-native-ui-lib";
import { eachBusLocationAndDetail } from "../types/businfo";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/config";
import { setTargetLocationInfo } from "../store/slice/busSlice";
interface alarmModal {
    isVisible: boolean;
    closeModal: Function;
    busRouteInfo: eachBusLocationAndDetail[];
    selectedStation: number;
    targetName: Function;
}

const AlarmModal = ({ isVisible, closeModal, busRouteInfo, selectedStation, targetName }: alarmModal) => {
    const [targetLocation, setTargetLocation] = useState<string>(busRouteInfo[0].STATION_NM);
    const dispatch = useAppDispatch();
    const alarmPushing = () => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: `목적지 도착 알람이 설정되었습니다`,
                body: `목적지 : ${targetLocation}`,
            },
            trigger: {
                seconds: 1,
            },
        });
    };

    useEffect(() => {
        if (selectedStation) {
            setTargetLocation(busRouteInfo.filter((v) => v.STATION_ID == selectedStation)[0].STATION_NM);
        }
    }, [selectedStation]);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const setAlarm = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            Alert.alert("Failed to get push token for push notification!");
            return;
        }
        alarmPushing();
        Location.startLocationUpdatesAsync("trackInfo");
    };

    const targetFiltering = (list: eachBusLocationAndDetail[], targetName: string) => {
        let i = 0;
        let filtered: eachBusLocationAndDetail[] = [];
        while (1) {
            if (list[i].STATION_NM == targetName || i > 200) {
                filtered.push(list[i]);
                break;
            }
            console.log(i);
            filtered.push(list[i++]);
        }
        return filtered;
    };

    return (
        <View style={styles.centeredView}>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>목적지 설정</Text>
                        <Picker style={styles.picker} selectedValue={targetLocation} onValueChange={(item) => setTargetLocation(item)}>
                            {busRouteInfo.map((v, i) => {
                                return <Picker.Item key={i} value={v.STATION_NM} label={v.STATION_NM} />;
                            })}
                        </Picker>
                        <View style={{ width: "75%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Pressable style={styles.button} onPress={() => closeModal()}>
                                <Text style={styles.textStyle} onPress={() => closeModal()}>
                                    취소
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.button}
                                onPress={async () => {
                                    const target = busRouteInfo.filter((v) => v.STATION_NM == targetLocation);
                                    await setAlarm();
                                    await targetName({ name: target[0].STATION_NM, list: targetFiltering(busRouteInfo, target[0].STATION_NM) });
                                    await closeModal();
                                }}
                            >
                                <Text style={styles.textStyle}>설정</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        width: "100%",
    },
    centeredView: {
        flex: 1,
        position: "absolute",
        top: "50%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        flex: 1,
        justifyContent: "space-between",
        width: "90%",
        height: "50%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        fontSize: 24,
        textAlign: "center",
    },
});

export default AlarmModal;
