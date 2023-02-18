import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store/config";
import Body from "./Componenet/Body";
import Header from "./Componenet/Header";

const App = () => {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
                    <Header />
                    <Body></Body>
                </SafeAreaView>
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </Provider>
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
