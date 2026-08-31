import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapCircleOverlay, NaverMapViewRef } from "@mj-studio/react-native-naver-map";
import { RESULTS } from "react-native-permissions";
import { useLocationPermission } from "@/shared/lib/hooks/useLocationPermission";
import { useCurrentLocation } from "@/shared/lib/hooks/useCurrentLocation";
import { HomeOverlay } from "@/widgets/home/ui/HomeOverlay";
import { DropMarker } from "@/entities/drop/ui/DropMarker";
import { useNearbyDrops } from "@/entities/drop/model/useNearbyDrops";
import { DropInfo } from "@/entities/drop/model/types";
import { DropDetailSheet } from "@/widgets/drop/ui/DropDetailSheet";

export const HomeScreen = () => {
    const {
        hasPermission,
        isChecking,
        status,
        requestLocationPermission,
        openSettings
    } = useLocationPermission();
    const { location } = useCurrentLocation(hasPermission);

    // 1. 지도 명령형 제어를 위한 Ref
    const mapRef = useRef<NaverMapViewRef>(null);
    // 2. 최초 1회 카메라 이동을 추적하는 상태
    const [isInitialLocationTracked, setIsInitialLocationTracked] = useState(false);

    // 선택된 드롭 객체를 통째로 저장하는 상태 (바텀 시트에 넘겨줄 목적)
    const [selectedDrop, setSelectedDrop] = useState<DropInfo | null>(null);

    // 3. 서버 API 연동 (내 위치 기반 주변 DROP 조회)
    // location이 존재할 때만 쿼리를 활성화(enabled)
    const {
        data: drops = [], // 데이터가 없거나 로딩 중일 때는 빈 배열을 기본값으로 사용
        isLoading: isDropsLoading,
        error: dropsError
    } = useNearbyDrops({
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        radius: 50
    }, !!location);

    // 버튼 클릭 액션을 메모이제이션하여 렌더링 최적화
    const handlePermissionRequest = useCallback(() => {
        if (status === RESULTS.BLOCKED) {
            openSettings();
        } else {
            requestLocationPermission();
        }
    }, [status, openSettings, requestLocationPermission]);

    // 위치를 처음 받아왔을 때 딱 한 번만 내 위치로 카메라를 스무스하게 이동시킴
    useEffect(() => {
        if (location && !isInitialLocationTracked && mapRef.current) {
            mapRef.current?.animateCameraTo({
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: 15,
            });
            setIsInitialLocationTracked(true); // 이후로는 이동 금지
        }
    }, [location, isInitialLocationTracked]);

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
                ref={mapRef}
                style={styles.map}
                isShowLocationButton={false}
                isShowCompass={false}
                isShowScaleBar={false}
                isShowZoomControls={false}
                locationOverlay={
                    location
                        ? {
                            isVisible: true,
                            position: {
                                latitude: location.latitude,
                                longitude: location.longitude
                            }
                        } : { isVisible: false }
                }
                mapType="Basic"
                initialCamera={{
                    latitude: 37.5666102, // 초기 좌표 (서울시청)
                    longitude: 126.9783881,
                    zoom: 16,
                }}>
                {/* 실시간 위치 기반 50m 레이더 반경 오버레이 */}
                {location && (
                    <>
                        {/* 1. 레이더 반경 (50m로 수정) */}
                        <NaverMapCircleOverlay
                            latitude={location.latitude}
                            longitude={location.longitude}
                            radius={50}
                            color="rgba(0, 122, 255, 0.05)"
                            outlineWidth={1}
                            outlineColor="rgba(0, 122, 255, 0.2)"
                        />

                        {/* 2. 주변 DROP 마커들 렌더링 (누락되었던 부분 추가) */}
                        {drops.map((drop) => (
                            <DropMarker
                                key={drop.id}
                                drop={drop}
                                onPress={() => {
                                    // 1. 마커 클릭 시 선택 상태 업데이트
                                    setSelectedDrop(drop);

                                    // 2. 카메라를 클릭한 마커 위치로 부드럽게 이동 (UX 개선)
                                    mapRef.current?.animateCameraTo({
                                        latitude: drop.latitude,
                                        longitude: drop.longitude,
                                        zoom: 16,
                                    });
                                }}
                            />
                        ))}
                    </>
                )}
            </NaverMapView>

            <HomeOverlay
                dropCount={drops.length}
                radius={50}
                onCreateDrop={() => console.log("DROP 남기기 클릭됨!")} />

            {/* 드롭 상세 바텀 시트 */}
            <DropDetailSheet
                drop={selectedDrop}
                onClose={() => setSelectedDrop(null)}
            />
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