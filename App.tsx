import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Body from "./Componenet/Body";
import Header from "./Componenet/Header";
const App = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
                <Header />
                <Body></Body>
            </SafeAreaView>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 0,
    },
});

export default App;
