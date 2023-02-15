import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";
import { View } from "react-native-ui-lib";
import BusCard from "./BusCard";

const Body = () => {
    const [Search, onChangeSearch] = useState<string>("");
    const tmpData = [{ key: "113" }, { key: "115" }, { key: "110" }, { key: "111" }, { key: "112" }, { key: "116" }, { key: "120" }, { key: "54" }, { key: "250" }, { key: "253" }];
    return (
        <View style={styles.container}>
            <View style={styles.searchArea}>
                <Entypo name="magnifying-glass" size={24} color="black" style={{ marginRight: 15 }} />
                <TextInput style={styles.input} onChangeText={onChangeSearch} value={Search} placeholder="버스 혹은 목적지" keyboardType="number-pad" />
            </View>
            <FlatList style={styles.flatList} data={tmpData} renderItem={({ item }) => <BusCard busId={item.key} />} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    item: {
        fontSize: 20,
        height: 75,
    },
    flatList: {
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    searchArea: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    input: {
        fontSize: 24,
    },
});

export default Body;
