import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sparkles, Navigation } from "lucide-react-native";
import { CreateDropButton } from "@/features/drop/ui/CreateDropButton";

interface Props {
    dropCount: number;
    radius: number;
    onCreateDrop: () => void;
}

export const HomeOverlay = ({ dropCount, radius, onCreateDrop }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[styles.overlayContainer, { paddingTop: insets.top, paddingBottom: insets.bottom || 24 }]}
            pointerEvents="box-none">
            {/* 상단 묶음: Top Bar & Info Badge */}
            <View pointerEvents="box-none">
                <View style={styles.topBar} pointerEvents="box-none">
                    <Text style={styles.logoText}>DROP</Text>
                    <View style={styles.liveBadge}>
                        <Navigation color="#111111" size={14} strokeWidth={3} fill="#111111" />
                        <Text style={styles.liveBadgeText}>LIVE {radius}m</Text>
                    </View>
                </View>

                <View style={styles.infoBadgeContainer} pointerEvents="box-none">
                    <View style={styles.infoBadge}>
                        <Sparkles color="#111111" size={16} strokeWidth={2.5} />
                        <Text style={styles.infoBadgeText}>
                            내 주변에 <Text style={styles.boldText}>{dropCount}개</Text>의 DROP이 있어요
                        </Text>
                    </View>
                </View>
            </View>

            {/* 하단 묶음: CREATE BUTTON */}
            <View style={styles.bottomContainer} pointerEvents="box-none">
                <CreateDropButton onPress={onCreateDrop} />
            </View>
        </View>
    );
};

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
    }
});