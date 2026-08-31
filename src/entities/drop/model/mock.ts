import { DropInfo } from "./types";

/**
 * 더미데이터
 * 내 주변 드롭 조회
 */
export const DUMMY_DROPS: DropInfo[] = [
    {
        id: 'drop-1',
        content: '여기 커피 진짜 맛있어요!',
        latitude: 37.5667902,
        longitude: 126.9783881,
        author: { nickname: '익명' },
        likeCount: 12,
        dislikeCount: 0,
        commentCount: 3,
        expiresAt: '2026-08-28T04:17:26Z',
        distance: 3,
    },
    {
        id: 'drop-2',
        content: '오늘 시청 광장 날씨 최고네요',
        latitude: 37.5664502, // 시청 광장 쪽
        longitude: 126.9787000,
        author: { nickname: '익명' },
        likeCount: 5,
        dislikeCount: 1,
        commentCount: 0,
        expiresAt: '2026-08-28T12:00:00Z',
        distance: 5,
    },
    {
        id: 'drop-3',
        content: '퇴근하고 싶다...',
        latitude: 37.5666102,
        longitude: 126.9778800, // 덕수궁 쪽
        author: { nickname: '익명' },
        likeCount: 100,
        dislikeCount: 2,
        commentCount: 20,
        expiresAt: '2026-08-27T18:00:00Z',
        distance: 7,
    }
];