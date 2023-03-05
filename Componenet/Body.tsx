import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";
import { View } from "react-native-ui-lib";
import { useAppSelector } from "../store/config";
import { UIArriveInfoText } from "../types/businfo";
import BusCard from "./BusCard";

const Body = ({target}:{target:Function}) => {
    const [Search, onChangeSearch] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const busInfo = useAppSelector((state) => state.busSlice);
    const [filteredBusInfo, setFilteredBusInfo] = useState<UIArriveInfoText[]>();
    useEffect(() => {
        setFilteredBusInfo(busInfo.busList);
    }, [busInfo.busList]);

    useEffect(() => {
        if (keyword.length === 0) {
            setFilteredBusInfo(busInfo.busList);
        } else {
            setFilteredBusInfo(
                busInfo.busList.filter((v) => {
                    if (v.name.toString() === keyword || v.detailInfo.filter((v) => v.STATION_NM.indexOf(keyword) !== -1).length > 0) {
                        return true;
                    } else false;
                })
            );
        }
    }, [keyword]);

    const keywordFilter = (text: string) => {
        onChangeSearch(text);
        setKeyword(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchArea}>
                <Entypo name="magnifying-glass" size={24} color="black" style={{ marginRight: 15 }} />
                <TextInput style={styles.input} onChangeText={(text: string) => keywordFilter(text)} value={Search} placeholder="버스 혹은 목적지" keyboardType="number-pad" />
            </View>
            <FlatList style={styles.flatList} data={filteredBusInfo} renderItem={({ item }) => <BusCard busInfo={item} keyword={keyword} target={target}/>} />
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
