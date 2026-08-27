import React from "react";
import { StyleSheet, Platform, View, Image } from "react-native";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { DropInfo } from "../model/types";

interface Props {
    drop: DropInfo;
    onPress?: () => void;
}

// 불변하는 값은 컴포넌트 밖으로 빼서 메모리 할당 최적화
const MARKER_SIZE = 30;
const COMBINED_MARKER = require('@/shared/assets/images/zap.png');

export const DropMarker = ({ drop, onPress }: Props) => {
    // ios
    if (Platform.OS === 'ios') {
        return (
            <NaverMapMarkerOverlay
                latitude={drop.latitude}
                longitude={drop.longitude}
                width={MARKER_SIZE}
                height={MARKER_SIZE}
                onTap={onPress}
                anchor={{ x: 0.5, y: 0.5 }}
                image={COMBINED_MARKER}
            />
        );
    }
    // aos
    return (
        <NaverMapMarkerOverlay
            latitude={drop.latitude}
            longitude={drop.longitude}
            width={MARKER_SIZE}
            height={MARKER_SIZE}
            onTap={onPress}
            anchor={{ x: 0.5, y: 0.5 }}
        >
            <View collapsable={false} style={styles.markerContainer}>
                <Image
                    source={COMBINED_MARKER}
                    style={{ width: MARKER_SIZE, height: MARKER_SIZE }}
                    resizeMode="contain"
                />
            </View>
        </NaverMapMarkerOverlay>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        borderRadius: MARKER_SIZE / 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 4,
            },
        }),
    },
});