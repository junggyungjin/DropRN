import React, { useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView } from "@mj-studio/react-native-naver-map";
import { RESULTS } from "react-native-permissions";
import { useLocationPermission } from "@/shared/lib/hooks/useLocationPermission";

export const HomeScreen = () => {
    const {
        hasPermission,
        isChecking,
        status,
        requestLocationPermission,
        openSettings
    } = useLocationPermission();

    // 버튼 클릭 액션을 메모이제이션하여 렌더링 최적화
    const handlePermissionRequest = useCallback(() => {
        if (status === RESULTS.BLOCKED) {
            openSettings();
        } else {
            requestLocationPermission();
        }
    }, [status, openSettings, requestLocationPermission]);

    // 1. 권한 체크 중: 스플래시 직후의 부드러운 화면 전환을 위해 심플한 로딩
    if (isChecking) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#111111" />
            </View>
        );
    }

    // 2. 권한 거부/미부여 상태: 유저의 액션을 명확하게 유도하는 Fallback UI
    if (!hasPermission) {
        const isBlocked = status === RESULTS.BLOCKED;

        return (
            <SafeAreaView style={styles.centerContainer}>
                <View style={styles.permissionContent}>
                    <Text style={styles.permissionTitle}>
                        위치 권한이 필요합니다
                    </Text>
                    <Text style={styles.permissionDescription}>
                        {isBlocked
                            ? '주변의 Drop을 확인하려면\n설정에서 위치 권한을 항상 허용해 주세요.'
                            : '현재 위치를 기반으로 주변의 Drop을\n불러오기 위해 권한이 필요합니다.'}
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.permissionButton,
                            pressed && styles.permissionButtonPressed // 눌렀을 때의 스타일 결합
                        ]}
                        onPress={handlePermissionRequest}>
                        <Text style={styles.permissionButtonText}>
                            {isBlocked ? '기기 설정으로 이동' : '위치 권한 허용하기'}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // 3. 권한 허용 완료: 전체 화면(Edge-to-Edge) 지도 렌더링
    return (
        <View style={styles.container}>
            <NaverMapView
                style={styles.map}
                isShowLocationButton={true}
                mapType="Basic"
                // TODO: 추후 현재 위치를 실시간 추적하여 지도를 이동시키는 로직 추가 예정
                initialCamera={{
                    latitude: 37.5666102, // 초기 좌표 (서울시청)
                    longitude: 126.9783881,
                    zoom: 14,
                }} />

            {/* 
            TODO: FSD 아키텍처에 따라 아래 영역에 
            - Features: 새로운 Drop 남기기 FAB (Floating Action Button)
            - Widgets: 50m 레이더 반경 오버레이 컴포넌트 
             등이 추가될 예정입니다.
            */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    map: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionContent: {
        alignItems: 'center',
        paddingHorizontal: 32,
        width: '100%',
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111111',
        marginBottom: 12,
    },
    permissionDescription: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    permissionButton: {
        backgroundColor: '#111111',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    permissionButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});