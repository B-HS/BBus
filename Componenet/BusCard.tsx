import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, View } from "react-native-ui-lib";
import { UIArriveInfoText } from "../types/busifno";
import AlarmModal from "./AlarmModal";

interface busCardProps {
    busInfo: UIArriveInfoText;
}

const BusCard = ({busInfo}: busCardProps) => {
    const [modalStatus, setModalStatus] = useState<boolean>(false);

    return (
        <>
            {modalStatus && <AlarmModal isVisible={modalStatus} closeModal={setModalStatus} />}
            <Card
                flex
                row
                center
                style={styles.container}
                onPress={() => {
                    setModalStatus(!modalStatus);
                    console.log("pressed");
                }}
            >
                <View style={styles.nameSection}>
                    <Card.Section content={[{ text: busInfo.name, text30: true }]} />
                    <Card.Section content={[{ text: `${busInfo.endLocation} 방면`, text80: true }]} />
                </View>
                <View style={styles.detailSection}>
                    <Card.Section content={[{ text: `${busInfo.leftTime==2?"잠시 후":"약 " + busInfo.leftTime+"분"}`, text50: true }]} />
                    
                    <Card.Section content={[{ text: `${busInfo.leftCount}번째 전`, text80: true }]} />
                </View>
            </Card>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        marginBottom: 15,
        padding: 15,
    },
    nameSection:{
        width:"60%"
    },
    detailSection:{
        width:"35%"
    }
});

export default BusCard;
