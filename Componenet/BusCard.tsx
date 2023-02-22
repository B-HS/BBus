import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-ui-lib";
import { eachBusLocationAndDetail, UIArriveInfoText } from "../types/businfo";
import AlarmModal from "./AlarmModal";
import BusCardInfo from "./BusCardInfo";

interface busCardProps {
    busInfo: UIArriveInfoText;
    keyword?: string;
}

const BusCard = ({ busInfo, keyword }: busCardProps) => {
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [selectedBus, setSelectedBus] = useState<number>(0);
    const filteredBusInfo = () => {
        return busInfo.detailInfo
            .filter((v) => {
                if (busInfo.updwn == 0 && v.STATION_ORD > busInfo.targetNumber && v.STATION_ORD <= busInfo.trnNumber) {
                    return true;
                }
                if (busInfo.updwn == 1 && v.STATION_ORD > busInfo.targetNumber && v.STATION_ORD >= busInfo.trnNumber) {
                    return true;
                }
                return false;
            })
            .reduce((acc: eachBusLocationAndDetail[], current) => {
                if (acc.findIndex(({ STATION_NM }) => STATION_NM === current.STATION_NM) === -1) {
                    acc.push(current);
                }
                return acc;
            }, []);
    };
    return (
        <>
            {modalStatus && <AlarmModal isVisible={modalStatus} closeModal={setModalStatus} busRouteInfo={filteredBusInfo()} selectedStation={selectedBus} />}
            {!keyword && (
                <TouchableOpacity onPress={() => setModalStatus(true)}>
                    <BusCardInfo busInfo={busInfo} />
                </TouchableOpacity>
            )}
            {keyword && filteredBusInfo().filter((v) => v.STATION_NM.indexOf(keyword) != -1).length > 0 && (
                <Card style={styles.subContainer}>
                    {filteredBusInfo()
                        .filter((v) => v.STATION_NM.indexOf(keyword) != -1)
                        .reduce((acc: eachBusLocationAndDetail[], current) => {
                            if (acc.findIndex(({ STATION_NM }) => STATION_NM === current.STATION_NM) === -1) {
                                acc.push(current);
                            }
                            return acc;
                        }, [])
                        .map((val, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalStatus(true);
                                        setSelectedBus(val.STATION_ID);
                                    }}
                                >
                                    <BusCardInfo busInfo={busInfo} />
                                    <Card.Section style={styles.resultSection} key={index} content={[{ text: `${val.STATION_NM}`, text80: true }]} />
                                </TouchableOpacity>
                            );
                        })}
                </Card>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    subContainer: {
        justifyContent: "space-between",
        marginTop: -10,
        marginBottom: 20,
        padding: 15,
    },
    resultSection: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        width: "100%",
        alignItems: "center",
    },
});

export default BusCard;
