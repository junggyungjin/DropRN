import React from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";
import { PenLine } from "lucide-react-native";

interface Props {
    onPress: () => void;
}

export const CreateDropButton = ({ onPress }: Props) => {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="DROP 남기기"
            android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
            style={({ pressed }) => [
                styles.button,
                pressed && Platform.OS === 'ios' && styles.pressed
            ]}
            onPress={onPress}>
            <PenLine color="#FFFFFF" size={20} strokeWidth={2.5} />
            <Text style={styles.text}>DROP 남기기</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#111111',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 32,
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
