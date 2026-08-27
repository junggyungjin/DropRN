import { useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";

// 안드로이드 무한 대기 버그 해결: 최적화된 구글 플레이 서비스 위치 모듈 사용 강제
Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'playServices', // 가장 중요한 설정
});

export interface LocationState {
    latitude: number,
    longitude: number;
}

export const useCurrentLocation = (hasPermission: boolean) => {
    const [location, setLocation] = useState<LocationState | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hasPermission) return;

        console.log("현재 위치 상태:", location);
        console.log("에러 상태:", error);

        const watchId = Geolocation.watchPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError(null); // 위치를 찾으면 기존 에러 상태 초기화
            },
            (err) => {
                setError(err.message);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 5,          // 5미터 이상 이동 시에만 콜백 실행
                timeout: 15000,             // 15초 내에 응답 없으면 에러
                maximumAge: 10000           // 10초 이내의 캐시된 위치 데이터만 허용
            }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, [hasPermission]);

    return { location, error };
};