import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoogleLogin } from "@/features/auth/model/useGoogleLogin";

export const LoginScreen = () => {
    const { signInWithGoogle, isLoading } = useGoogleLogin();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>DROP</Text>
                <Text style={styles.subtitle}>현실 공간에 남기는 나의 흔적</Text>
            </View>

            <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={signInWithGoogle}
                disabled={isLoading}
                activeOpacity={0.8}>
                {isLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <View style={styles.buttonContent}>
                        {/* TODO: 구글 'G' 로고 이미지를 shared/assets 등에 추가 후 연결 */}
                        {<Image
                            source={require('@/shared/assets/images/google-icon.png')}
                            style={styles.googleIcon}
                        />}
                        <Text style={styles.buttonText}>Google 계정으로 시작하기</Text>
                    </View>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    titleWrapper: {
        alignItems: 'center',
        marginTop: 80,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#007AFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0A0A0',
        fontWeight: '600',
    },
    loginButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000'
    },
});