import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { SplashScreen } from '@/pages/splash/ui/SplashScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    // Zustand 공용 창고에서 상태를 실시간으로 구독
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const isLoggedIn = useAuthStore((state) => state.user !== null);

    // 1. 아직 토큰 검증이 안 끝났다면 스플래시 화면만 그림
    if (!isInitialized) {
        return <SplashScreen />;
    }

    // 2. 검증이 끝났다면 로그인 여부에 따라 완전히 분리된 스택을 렌더링
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                // 인증된 유저는 홈 화면
                // <Stack.Screen name="Home" component={HomeScreen} />
            ): (
                    // 미인증 유저는 로그인 화면
                    // <Stack.Screen name="Login" component={LoginScreen} />
                )}
        </Stack.Navigator>
    );
};