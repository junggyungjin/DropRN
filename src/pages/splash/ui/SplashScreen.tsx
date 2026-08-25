import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { tokenStorage } from "@/shared/lib/storage/tokenStorage";
import { useAuthActions } from "@/features/auth/model/useAuthStore";
import { apiCliecnt } from "@/shared/api/apiClient";
import { User } from "@/features/auth/model/useAuthStore";
import { ApiResponse } from "@/shared/api/types";

export const SplashScreen = () => {
    const { setAuth, setInitialized } = useAuthActions();

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const refreshToken = await tokenStorage.getRefreshToken();

                console.log('스플래쉬 스크린');

                if (refreshToken) {
                    // TODO : 실제 유저 정보 조회 API 호출
                    const response = await apiCliecnt.get<ApiResponse<User>>('/users/me');
                    const userData = response.data.data;

                    if (!userData || !userData.id) {
                        throw new Error('Invalid user data received from server');
                    }

                    setAuth({ id: userData?.id });
                }
                // 토큰이 없으면 setAuth를 호출하지 않으므로 자연스럽게 user=null 상태 유지
            } catch (error) {
                console.error('[SplashScreen] Auto-login verification failed:', error);
            } finally {
                setInitialized(); // 초기화 완료 라우터가 알아서 화면 전환
            }
        };

        const timeoutId = setTimeout(() => {
            initializeApp();
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [setAuth, setInitialized]);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>DROP</Text>
            <Text style={styles.subtitle}>현실에 남기는 디지털 포스트잇</Text>
            <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
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