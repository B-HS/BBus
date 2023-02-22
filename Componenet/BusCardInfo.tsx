import { Card, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import { UIArriveInfoText } from "../types/businfo";

interface busCardProps {
    busInfo: UIArriveInfoText;
    keyword?: string;
}

const BusCardInfo = ({busInfo} : busCardProps) => {
    return (
        <Card
            flex
            row
            center
            style={styles.container}
        >
            <View style={styles.nameSection}>
                <Card.Section content={[{ text: busInfo.name, text30: true }]} />
                <Card.Section content={[{ text: `${busInfo.endLocation} 방면`, text80: true }]} />
            </View>
            <View style={styles.detailSection}>
                <Card.Section content={[{ text: `${busInfo.leftTime < 3 ? "잠시 후" : "약 " + busInfo.leftTime + "분"}`, text50: true }]} />
                <Card.Section content={[{ text: `${busInfo.currentLocation}`, text80: true }]} />
                <Card.Section content={[{ text: `앞으로 ${busInfo.leftCount} 정거장`, text80: true }]} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 15,
        padding: 15,
    },
    nameSection: {
        width: "35%",
        alignItems: "center",
    },
    detailSection: {
        width: "35%",
        alignItems: "center",
    },
});

export default BusCardInfo
