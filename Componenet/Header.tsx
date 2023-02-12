import { MaterialCommunityIcons, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import React, { useState } from "react";
import { View } from "react-native-ui-lib";

const Header = () => {
    const [location, setLocation] = useState<LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const requestPermissions = async () => {
        let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
            setErrorMsg("location denied");
            return;
        } else {
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus === "granted") {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } else {
                setErrorMsg("background denied");
                return;
            }
        }
    };
    const getLocation = async () => {
        await requestPermissions();
        if (errorMsg.length > 0) {
            alert(errorMsg);
            alert("aa");
        } else {
            // JSON.stringify(location) <<위치정보
        }
    };
    return (
        <View style={styles.header}>
            <SimpleLineIcons name="menu" size={24} color="black" />
            <View style={styles.locationSection}>
                <Text style={styles.targetLoacation}>현재장소</Text>
                <AntDesign name="caretdown" size={12} color="gray" />
            </View>
            <TouchableOpacity onPress={getLocation}>
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
        marginRight:5, 
        fontSize: 20,
    },
    locationSection:{
        flexDirection: "row",
        alignItems: "center",
    }
});

export default Header;
