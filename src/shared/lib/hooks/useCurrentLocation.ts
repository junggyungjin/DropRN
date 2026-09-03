import { useState, useEffect } from "react";
import * as Location from 'expo-location';

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

        let subscription: Location.LocationSubscription | null = null;

        const startWatching = async () => {
            try {
                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5, // 5미터 이상 이동 시에만 콜백 실행
                        timeInterval: 10000, // 폴링 간격
                    },
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setError(null);
                    }
                );
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('알 수 없는 위치 에러가 발생했습니다.');
                }
            }
        };

        startWatching();

        // 컴포넌트 언마운트 시 실시간 추적(watch) 정리
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [hasPermission]);

    return { location, error };
};