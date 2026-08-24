import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthActions } from '@/features/auth/model/useAuthStore';
import { tokenStorage } from '@/shared/lib/storage/tokenStorage';

export const HomeScreen = () => {
    const { clearAuth } = useAuthActions();

    const handleLogout = async () => {
        await tokenStorage.clearToken();
        clearAuth();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>구글 로그인 성공!</Text>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>로그아웃 테스트</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    logoutButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});