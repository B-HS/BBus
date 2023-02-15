import * as Notifications from "expo-notifications";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Modal, Text, View } from "react-native-ui-lib";

interface alarmModal {
    isVisible: boolean;
    closeModal: Function;
}

const AlarmModal = ({ isVisible, closeModal }: alarmModal) => {
    const alarmPushing = () => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Time's up!",
                body: "Change sides!",
            },
            trigger: {
                seconds: 1, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
            },
        });
    };

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
    };

    return (
        <View style={styles.centeredView}>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <View style={{ width: "75%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Pressable style={styles.button} onPress={() => closeModal()}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() => setAlarm()}>
                                <Text style={styles.textStyle}>ALARRRRRRRm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        paddingVertical: 10,
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
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
});

export default AlarmModal;
