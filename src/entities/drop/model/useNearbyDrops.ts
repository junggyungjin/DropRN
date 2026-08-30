import { useQuery } from "@tanstack/react-query";
import { getNearbyDrops, GetNearbyDropsParms } from "../api/dropApi";

export const useNearbyDrops = (params: GetNearbyDropsParms, enabled: boolean = true) => {
    // 1. 캐시 무효화 폭격을 막기 위한 위경도 반올림 처리 (소수점 4자리 ≒ 약 11m 해상도)
    // 지도를 11m 이내로 미세하게 움직일 때는 기존 캐시(staleTime)를 재사용
    const cacheLat = params.latitude ? params.latitude.toFixed(4) : null;
    const cacheLng = params.longitude ? params.longitude.toFixed(4) : null;

    return useQuery({
        // 파라미터가 유의미하게(약 11m 이상) 바뀔 때만 새로운 캐시 키로 인식
        queryKey: ['drops', 'nearby', cacheLat, cacheLng, params.radius],
        queryFn: () => getNearbyDrops(params),
        // 2. '0' 좌표 버그 방지를 위해 undefined 체크로 변경
        enabled: enabled && params.latitude !== undefined && params.longitude !== undefined,

        // 10초 내에는 캐시 데이터 유지(불필요한 중복 호출 방지)
        staleTime: 1000 * 10,
    });
};