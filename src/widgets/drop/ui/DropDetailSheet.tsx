import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Platform } from "react-native";
import { DropInfo } from "@/entities/drop/model/types";
import { ThumbsUp, ThumbsDown, X, Flame, Clock } from "lucide-react-native";
import { getDropTimeLeft } from "@/entities/drop/lib/timeUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * 바텀 시트 위젯
 */

interface Props {
    drop: DropInfo | null;
    onClose: () => void;
}

const SHEET_HEIGHT = 400; // 애니메이션을 위한 넉넉한 Y축 오프셋

export const DropDetailSheet = ({ drop, onClose }: Props) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

    // 닫힐 때 데이터(글씨)가 먼저 사라져버리는 것을 방지하기 위해 
    // 마지막으로 선택된 drop 데이터를 캐싱해둡니다.
    const lastDropRef = useRef<DropInfo | null>(null);
    if (drop) {
        lastDropRef.current = drop;
    }
    const displayDrop = drop || lastDropRef.current;

    useEffect(() => {
        if (drop) {
            // 열림 애니메이션
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 10,
            }).start();
        } else {
            // 닫힘 애니메이션
            Animated.timing(translateY, {
                toValue: SHEET_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [drop]);

    // 보여줄 데이터가 없으면 아예 렌더링하지 않음
    if (!displayDrop) return null;

    return (
        <Animated.View
            style={[
                styles.sheetContainer,
                {
                    paddingBottom: (insets.bottom || 24) + 12,
                    transform: [{ translateY }]
                }
            ]}>
            {/* 상단 손잡이(핸들) 영역 */}
            <View style={styles.handleBar} />

            {/* 헤더: 불꽃 아이콘과 남은 시간 */}
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Flame color="#FF5252" size={16} strokeWidth={2.5} />
                    <Text style={styles.badgeText}>실시간</Text>
                </View>
                <View style={styles.badge}>
                    <Clock color="#111111" size={16} strokeWidth={2.5} />
                    <Text style={styles.badgeText}>
                        {getDropTimeLeft(displayDrop.expiresAt)}
                    </Text>
                </View>
            </View>

            {/* 본문 내용 */}
            <Text style={styles.content} numberOfLines={3}>
                {displayDrop.content}
            </Text>

            {/* 하단 좋아요/싫어요 및 닫기 버튼 */}
            <View style={styles.footer}>
                <View style={styles.actionRow}>
                    <Pressable style={styles.actionButton}>
                        <ThumbsUp color="#111111" size={20} strokeWidth={2.5} />
                        <Text style={styles.actionText}>
                            {displayDrop.likeCount}
                        </Text>
                    </Pressable>
                    <Pressable style={styles.actionButton}>
                        <ThumbsDown color="#999999" size={20} strokeWidth={2.5} />
                        <Text style={[styles.actionText, { color: '#999999' }]}>
                            {displayDrop.dislikeCount}
                        </Text>
                    </Pressable>
                </View>

                {/* X 버튼으로 닫기 트리거 */}
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <X color="#111111" size={22} strokeWidth={3} />
                </Pressable>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, heigh: -4 },
                shadowOpacitoy: 0.1,
                shadowRadius: 16,
            },
            android: {
                elevation: 24,
            },
        }),
    },
    handleBar: {
        width: 48,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111111',
    },
    content: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111111',
        lineHeight: 32,
        marginBottom: 32,
        letterSpacing: -0.5
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 24,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 24,
        gap: 8,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111111',
    },
    closeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    }
});