import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const SplashScreen = () => {
    useEffect(() => {
        // TODO: JWT 자동 로그인 체크 및 위치 권한 요청 로직
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>DROP</Text>
            <Text style={styles.subtitle}>현실에 남기는 디지털 포스트잇</Text>
            <ActivityIndicator style={styles.loader}
                size="large" color="#007AFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E', // 모던한 다크 테마 배경
    },
    logo: {
        fontSize: 48,
        fontWeight: '900',
        color: '#007AFF', // 물방울(Drop)과 어울리는 블루 컬러
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0A0A0',
        fontWeight: '600',
    },
    loader: {
        marginTop: 40,
    }
});