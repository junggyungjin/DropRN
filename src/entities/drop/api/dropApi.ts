import { apiClient } from "@/shared/api/apiClient";
import { DropInfo } from "../model/types";
import { ApiResponse } from "@/shared/api/types";

// API 요청 파라미터 타입
export interface GetNearbyDropsParams {
    latitude: number;
    longitude: number;
    radius?: number; // 미입력시 서버 디폴트값 사용(50m)
}

export interface CreateDropRequest {
    content: string;
    latitude: number;
    longitude: number;
    ttlHours: number;
}

{/* 서버 호출 함수들 */ }

// 주변 드롭 조회
export const getNearbyDrops = async (params: GetNearbyDropsParams): Promise<DropInfo[]> => {
    const { data } = await apiClient.get<ApiResponse<DropInfo[]>>('drops/nearby', { params });

    if (!data.success || !data.data) {
        throw new Error(data.error?.message || '주변 DROP을 불러오는 데 실패했습니다.');
    }

    return data.data;
};

// 드롭 생성
export const createDrop = async (params: CreateDropRequest): Promise<DropInfo> => {
    const { data } = await apiClient.post<ApiResponse<DropInfo>>('drops', params);

    if (!data.success || !data.data) {
        throw new Error(data.error?.message || 'DROP 생성에 실패했습니다.');
    }

    return data.data;
}