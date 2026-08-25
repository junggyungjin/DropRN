import axios, { InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../lib/storage/tokenStorage";
import { useAuthStore } from "@/features/auth/model/useAuthStore";

/**
 * Axios 인스턴스 및 인터셉터 셋팅
 * 백엔드와 통신할 기본 HTTP 클라이언트(axios) 구성
 * 프론트엔드 자동 로그인의 핵심 로직도 포함됨
 */

const BASE_URL = 'http://192.168.45.197:3000/api';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const apiCliecnt = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 동시성 처리를 위한 상태 변수 ---
let isRefreshing = false;
let refreshSubscribers: ((accessToken: string) => void)[] = [];

// 대기열에 있는 모든 요청에 새로운 토큰을 주입하여 재실행하는 함수
const onRefreshed = (accessToken: string) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
};

// 대기열에 요청을 추가하는 함수
const addRefreshSubscriber = (callback: (accessToken: string) => void) => {
    refreshSubscribers.push(callback);
};
// -------------------------------------------

// 1. 요청 인터셉터
apiCliecnt.interceptors.request.use(
    async (config) => {
        const accessToken = await tokenStorage.getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

// 2. 응답 인터셉터
apiCliecnt.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 이미 누군가 토큰을 갱신 중이라면, 대기열에 Promise를 담아두고 기다림
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((accessToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(apiCliecnt(originalRequest));
                    });
                });
            }

            // 내가 첫 번째 401 에러라면 갱신 시작

            try {
                const refreshToken = await tokenStorage.getRefreshToken();

                if (!refreshToken) {
                    throw new Error('Refresh token not found');
                }

                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const newAccesstoken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;
                await tokenStorage.setTokens(newAccesstoken, newRefreshToken);

                // 갱신이 성공하면 대기열에 있던 모든 요청을 새 토큰과 함께 순차적으로 실행
                onRefreshed(newAccesstoken);

                originalRequest.headers.Authorization = `Bearer ${newAccesstoken}`;
                return apiCliecnt(originalRequest);
            } catch (refreshError) {
                console.error('[Axios] Refresh logic failed. Forcing logout.', refreshError);
                await tokenStorage.clearToken();

                // 상태 관리(Zustand)와 연결하여 강제 로그아웃
                useAuthStore.getState().actions.clearAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false; // 성공하든 실패하든 플래그 초기화
            }
        }

        return Promise.reject(error);
    }
);