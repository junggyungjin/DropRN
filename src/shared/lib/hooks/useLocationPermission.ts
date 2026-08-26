import { useEffect, useState, useCallback } from "react";
import { Platform, AppState, AppStateStatus, Linking } from "react-native";
import { check, request, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';

interface UseLocationPermissionReturn {
    hasPermission: boolean;
    isChecking: boolean;
    status: PermissionStatus | null;
    requestLocationPermission: () => Promise<void>;
    openSettings: () => void;
}

export const useLocationPermission = (): UseLocationPermissionReturn => {
    const [status, setStatus] = useState<PermissionStatus | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

    // 단순히 체크만 하는 함수 (앱 포그라운드 진입 시 갱신용)
    const checkPermission = useCallback(async () => {
        try {
            const currentStatus = await check(permission);
            setStatus(currentStatus);
        } catch (error) {
            console.error('Location check failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, [permission]);

    // 유저 액션(버튼 클릭 등)에 의해 실제 권한을 요청하는 함수
    const requestLocationPermission = useCallback(async () => {
        if (status === RESULTS.BLOCKED) {
            // BLOCKED 상태면 요청 팝업이 안 뜨므로 바로 설정창으로 유도
            Linking.openSettings();
            return;
        }

        try {
            setIsChecking(true);
            const newStatus = await request(permission);
            setStatus(newStatus);
        } catch (error) {
            console.error('Location request failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, [permission, status]);

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
        hasPermission: status === RESULTS.GRANTED,
        status,
        isChecking,
        requestLocationPermission,
        openSettings,
    };
};