import { StyleSheet } from "react-native";
import { Card, View } from "react-native-ui-lib";

interface busCardProps {
    busId: string;
}

const BusCard = (props: busCardProps) => {
    return (
        <Card flex row style={styles.container} onPress={() => console.log("pressed")}>
            <View>
                <Card.Section content={[{ text: props.busId, text50: true }]} />
                <Card.Section content={[{ text: props.busId, text50: true }]} />
            </View>
            <View>
                <Card.Section content={[{ text: props.busId, text50: true }]} />
                <Card.Section content={[{ text: props.busId, text50: true }]} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent:"space-between",
        marginBottom:15,
        padding:15
    },
});

export default BusCard;
