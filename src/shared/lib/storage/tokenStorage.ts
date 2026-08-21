import EncryptedStorage from "react-native-encrypted-storage";

/**
 * 보안 스토리지 유틸리티 생성
 */

const STORAGE_KEYS = {
    ACCESS_TOKEN_KEY: 'DROP_ACCESS_TOKEN',
    REFRESH_TOKEN_KEY: 'DROP_REFRESH_TOKEN',
} as const;

export const tokenStorage = {
    // 토큰 쌍 저장 (로그인/토큰 갱신 성공 시)
    setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
        try {
            await Promise.all([
                EncryptedStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_KEY, accessToken),
                EncryptedStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_KEY, refreshToken),
            ]);
        } catch (error) {
            await tokenStorage.clearToken(); // 상태 불일치 방지를 위한 롤백
            throw new Error('[TokenStorage] Failed to save tokens, rolled back.');
        }
    },

    // Access Token 가져오기 (API 요청 시)
    getAccessToken: async (): Promise<string | null> => {
        try {
            return await EncryptedStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_KEY);
        } catch (error) {
            throw new Error('[TokenStorage] Access token retrieval failed.');
        }
    },

    getRefreshToken: async (): Promise<string | null> => {
        try {
            return await EncryptedStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        } catch (error) {
            throw new Error('[TokenStorage] Refresh token retrieval failed.');
        }
    },

    clearToken: async (): Promise<void> => {
        try {
            await Promise.all([
                EncryptedStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_KEY),
                EncryptedStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_KEY),
            ])
        } catch (error) {
            console.error('[TokenStorage] Non-critical error during clearTokens:', error);
        }
    },
};