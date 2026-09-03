import { useEffect, useState, useCallback } from "react";
import { AppState, AppStateStatus, Linking } from "react-native";
import * as Location from 'expo-location';

interface UseLocationPermissionReturn {
    hasPermission: boolean;
    isChecking: boolean;
    status: Location.PermissionStatus | null;
    canAskAgain: boolean;
    requestLocationPermission: () => Promise<void>;
    openSettings: () => void;
}

export const useLocationPermission = (): UseLocationPermissionReturn => {
    const [status, setStatus] = useState<Location.PermissionStatus | null>(null);
    const [canAskAgain, setCanAskAgain] = useState<boolean>(true);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    // 단순히 체크만 하는 함수 (앱 포그라운드 진입 시 갱신용)
    const checkPermission = useCallback(async () => {
        try {
            const { status: currentStatus, canAskAgain: currentCanAskAgain } = await
                Location.getForegroundPermissionsAsync();
            setStatus(currentStatus);
            setCanAskAgain(currentCanAskAgain);
        } catch (error) {
            console.error('Location check failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, []);

    // 유저 액션(버튼 클릭 등)에 의해 실제 권한을 요청하는 함수
    const requestLocationPermission = useCallback(async () => {
        if (!canAskAgain) {
            // 권한이 영구 거부된 경우 설정창으로 유도
            Linking.openSettings();
            return;
        }

        try {
            setIsChecking(true);
            const { status: newStatus, canAskAgain: newCanAskAgain } = await
                Location.requestForegroundPermissionsAsync();
            setStatus(newStatus);
            setCanAskAgain(newCanAskAgain);
        } catch (error) {
            console.error('Location request failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, [canAskAgain]);

    // 설정 앱으로 이동
    const openSettings = useCallback(() => {
        Linking.openSettings();
    }, []);

    // 1. 초기 상태 체크 및 2. 앱이 포그라운드로 돌아올 때 상태 재확인
    useEffect(() => {
        checkPermission();

        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                checkPermission();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [checkPermission]);

    return {
        hasPermission: status === Location.PermissionStatus.GRANTED,
        status,
        canAskAgain,
        isChecking,
        requestLocationPermission,
        openSettings,
    };
};