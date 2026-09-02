import React, { memo } from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sparkles, Navigation, X } from "lucide-react-native";
import { CreateDropButton } from "@/features/drop/ui/CreateDropButton";

interface Props {
    dropCount: number;
    radius: number;
    isCreatingDrop?: boolean;
    onCreateDrop: () => void;
    onCancelCreate?: () => void;
    onConfirmLocation?: () => void;
}

export const HomeOverlay = memo(({
    dropCount,
    radius,
    isCreatingDrop,
    onCreateDrop,
    onCancelCreate,
    onConfirmLocation
}: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[styles.overlayContainer, { paddingTop: insets.top, paddingBottom: insets.bottom || 24 }]}
            pointerEvents="box-none">
            {/* 상단 묶음: Top Bar & Info Badge */}
            <View pointerEvents="box-none">
                <View style={styles.topBar} pointerEvents="box-none">

                    {isCreatingDrop ? (
                        <>
                            {/* 위치 지정 취소 버튼 */}
                            <Pressable
                                onPress={onCancelCreate}
                                style={({ pressed }) =>
                                    [styles.iconButton, pressed && { opacity: 0.5 }]}>
                                <X color="#111111" size={28} strokeWidth={2.5} />
                            </Pressable>

                            <Text style={styles.instructionText}>드래그하여 위치 조정</Text>

                            {/* flex 레이아웃 중앙 정렬을 위한 더미 뷰 */}
                            <View style={{ width: 44 }} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.logoText}>DROP</Text>
                            <View style={styles.liveBadge}>
                                <Navigation color="#111111" size={14} strokeWidth={3} fill="#111111" />
                                <Text style={styles.liveBadgeText}>LIVE {radius}m</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* 생성 모드일 때는 주변 드롭 개수 뱃지를 숨겨서 시야를 확보합니다 */}
                {!isCreatingDrop && (
                    <View style={styles.infoBadgeContainer} pointerEvents="box-none">
                        <View style={styles.infoBadge}>
                            <Sparkles color="#111111" size={16} strokeWidth={2.5} />
                            <Text style={styles.infoBadgeText}>
                                내 주변에 <Text style={styles.boldText}>{dropCount}개</Text>의 DROP이 있어요
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* 하단 묶음: CREATE BUTTON */}
            <View style={styles.bottomContainer} pointerEvents="box-none">
                {isCreatingDrop ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.confirmButton,
                            pressed && styles.confirmButtonPressed
                        ]}
                        onPress={onConfirmLocation}>
                        <Text style={styles.confirmButtonText}>이 위치로 확정하기</Text>
                    </Pressable>
                ) : (
                    <CreateDropButton onPress={onCreateDrop} />
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        justifyContent: 'space-between'
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 12,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111111',
        letterSpacing: -1,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    liveBadgeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111111',
    },
    iconButton: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    instructionText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111111',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    infoBadgeContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        gap: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    infoBadgeText: {
        fontSize: 15,
        color: '#444444',
        fontWeight: '500',
    },
    boldText: {
        fontWeight: '800',
        color: '#111111',
    },
    bottomContainer: {
        alignItems: 'center',
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    confirmButton: {
        backgroundColor: '#111111',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 100,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    }
});