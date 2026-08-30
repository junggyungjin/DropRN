import { useState } from "react";
import { GoogleSignin, statusCodes, isErrorWithCode } from "@react-native-google-signin/google-signin";
import { apiClient } from "@/shared/api/apiClient";
import { tokenStorage } from "@/shared/lib/storage/tokenStorage";
import { useAuthActions } from "./useAuthStore";
import { ApiResponse } from "@/shared/api/types";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
}

export const useGoogleLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { setAuth } = useAuthActions();

    const signInWithGoogle = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();

            const idToken = userInfo.data?.idToken;

            console.log('테스트');

            if (!idToken) {
                throw new Error('Google Sign-in failed: No Id Token retrieved.');
            }

            const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google/login', { idToken });

            const data = response.data.data;
            if (!data) {
                throw new Error('Invalid response from server: data is missing');
            }

            const { accessToken, refreshToken, isNewUser } = data;

            await tokenStorage.setTokens(accessToken, refreshToken);

            const profileResponse = await apiClient.get('/users/me');
            const userData = profileResponse.data.data;

            if (!userData || !userData.id) {
                throw new Error('Failed to fetch user profile after login');
            }

            // 전역 상태 업데이트 -> RootNavigator가 감지하고 Home으로 이동!
            setAuth({ id: userData.id });
        } catch (error) {
            // 구글 라이브러리에서 발생한 규격화된 에러인지 확인
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // 유저가 팝업을 그냥 끈 경우: 조용히 무시
                        console.log('User cancelled the login flow');
                        return;
                    case statusCodes.IN_PROGRESS:
                        console.log('Login is already in progress');
                        return;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // 안드로이드에서 구글 플레이 서비스가 없는 경우
                        console.error('Play services not available or outdated');
                        break;
                }
            }

            console.error('[useGoogleLogin] OAuth Flow Error:', error);
            // TODO: 진짜 에러인 경우에만 스낵바(Snackbar) 띄우기
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signInWithGoogle,
        isLoading,
    };
};