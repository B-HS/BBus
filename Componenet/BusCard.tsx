import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, View } from "react-native-ui-lib";
import AlarmModal from "./AlarmModal";

interface busCardProps {
    busId: string;
}

const BusCard = (props: busCardProps) => {
    const [modalStatus, setModalStatus] = useState<boolean>(false);

    return (
        <>
            {modalStatus && <AlarmModal isVisible={modalStatus} closeModal={setModalStatus} />}
            <Card
                flex
                row
                style={styles.container}
                onPress={() => {
                    setModalStatus(!modalStatus);
                    console.log("pressed");
                }}
            >
                <View>
                    <Card.Section content={[{ text: props.busId, text50: true }]} />
                    <Card.Section content={[{ text: props.busId, text50: true }]} />
                </View>
                <View>
                    <Card.Section content={[{ text: props.busId, text50: true }]} />
                    <Card.Section content={[{ text: props.busId, text50: true }]} />
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
});

export default BusCard;
