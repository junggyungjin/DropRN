import { create } from "zustand";

/**
 * 전역 인증 상태 관리(Zustand Auth Store) 셋팅
 */

export interface User {
    id: string;
}

interface AuthState {
    isInitialized: boolean; // 앱 렌더링 초기화(토큰 검증 완료) 여부
    user: User | null;
}

interface AuthActions {
    // Action들을 하나의 객체로 묶어 관리
    actions: {
        setAuth: (user: User) => void;
        clearAuth: () => void;
        setInitialized: () => void;
    };
}

/**
 * 전역 인증 상태 Store
 * State와 Action을 분리하여 불필요한 리렌더링을 방지할 수 있는 구조로 설계
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    isInitialized: false,
    user: null,

    actions: {
        setAuth: (user) => set({ user }),
        clearAuth: () => set({ user: null }),
        setInitialized: () => set({ isInitialized: true }),
    },
}));

export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useIsLoggedIn = () => useAuthStore((state) => state.user !== null);