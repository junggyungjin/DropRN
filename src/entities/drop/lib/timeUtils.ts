// src/entities/drop/lib/timeUtils.ts

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ko'; // 한국어 설정

// dayjs 플러그인 활성화
dayjs.extend(duration);
dayjs.locale('ko');

/**
 * drop 도메인에서만 사용되는 시간 유틸
 * 
 * @param expiresAt ISO 날짜 문자열 (예: "2026-08-28T04:17:26.000Z")
 * @returns "3시간 남음", "10분 남음", "만료됨" 등의 UI 텍스트
 */
export const getDropTimeLeft = (expiresAt: string): string => {
    const now = dayjs();
    const expiration = dayjs(expiresAt);

    // 이미 시간이 지난 경우
    if (expiration.isBefore(now)) {
        return '만료됨';
    }

    const diffMs = expiration.diff(now);
    const diffDuration = dayjs.duration(diffMs);

    // 24시간 이상 남았을 경우
    if (diffDuration.asHours() >= 24) {
        const days = Math.floor(diffDuration.asDays());
        return `${days}일 남음`;
    }

    // 1시간 이상 남았을 경우
    if (diffDuration.asHours() >= 1) {
        const hours = Math.floor(diffDuration.asHours());
        return `${hours}시간 남음`;
    }

    // 1시간 미만일 경우
    const minutes = Math.floor(diffDuration.asMinutes());
    return `${minutes}분 남음`;
};