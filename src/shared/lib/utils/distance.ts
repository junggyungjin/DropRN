const R = 6371e3; // 지구의 반지름 (미터) 지구의 반지름은 6,371KM
const PI_OVER_180 = Math.PI / 180;

// 1. 함수 외부로 분리하여 메모리 재할당 방지 및 상수 곱셈으로 최적화
const toRadians = (degree: number) => degree * PI_OVER_180;

/**
 * 두 GPS 좌표 간의 거리를 미터 단위로 계산.
 * 극단거리(예: 50m 반경) UI 인터랙션 최적화를 위해 방형도법(Equirectangular) 근사를 사용
 * 
 * @param lat1 첫 번째 지점의 위도
 * @param lon1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lon2 두 번째 지점의 경도
 * @returns 두 좌표 간의 거리 (미터)
 */
export const calculateDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    // 위도, 경도 차이를 라디안으로 변환
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    // 평균 위도 계산
    const meanLat = toRadians((lat1 + lat2) / 2);

    // 평면 좌표계로 투영 (피타고라스 정리 활용)
    const x = deltaLon * Math.cos(meanLat);
    const y = deltaLat;

    // 최종 거리 계산 (c^2 = a^2 + b^2)
    const distance = Math.sqrt(x * x + y * y) * R;

    return Math.round(distance);
};