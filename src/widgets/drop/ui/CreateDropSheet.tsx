import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View, Text, Animated, Pressable, Platform,
    TextInput, KeyboardAvoidingView, Dimensions, Keyboard, TouchableWithoutFeedback,
    StyleSheet
} from "react-native";
import { X, MapPin, Timer } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateDrop } from "@/features/drop/api/useCreateDrop";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Toast from "react-native-toast-message";

interface Props {
    isVisible: boolean;
    draftLocation: { latitude: number; longitude: number } | null;
    onClose: () => void;
    onSuccess: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_LENGTH = 300;

export const CreateDropSheet = ({ isVisible, draftLocation, onClose, onSuccess }: Props) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // 물리적인 렌더링 여부를 관리하는 상태 추가
    const [isRendered, setIsRendered] = useState(false);

    const [content, setContent] = useState("");
    const [ttlHours, setTtlHours] = useState<1 | 12 | 24>(1);

    const { mutate: createDrop, isPending } = useCreateDrop();

    useEffect(() => {
        if (isVisible) {
            setIsRendered(true);
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 10,
            }).start();
        } else if (isRendered) {
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    // 애니메이션이 완전히 끝난 후 메모리에서 언마운트 및 상태 초기화
                    setIsRendered(false);
                    setContent("");
                    setTtlHours(1);
                }
            });
        }
    }, [isVisible, isRendered, translateY]);

    const handleSubmit = useCallback(() => {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            Toast.show({ type: 'error', text1: '내용을 입력해주세요.' });
            return;
        }
        if (!draftLocation) return;

        ReactNativeHapticFeedback.trigger("impactMedium");

        createDrop(
            {
                content: trimmedContent,
                latitude: draftLocation.latitude,
                longitude: draftLocation.longitude,
                ttlHours
            },
            {
                onSuccess: () => {
                    Toast.show({ type: 'success', text1: '드롭 성공' });
                    onSuccess();
                }
            }
        );
    }, [content, draftLocation, ttlHours, createDrop, onSuccess]);

    const handleTtlSelect = useCallback((hours: 1 | 12 | 24) => {
        ReactNativeHapticFeedback.trigger("selection");
        setTtlHours(hours);
    }, []);

    if (!isRendered) return null;

    return (
        <Animated.View
            style={[
                styles.sheetContainer,
                {
                    paddingTop: insets.top + 16,
                    paddingBottom: (insets.bottom || 24) + 12,
                    transform: [{ translateY }]
                }
            ]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* 상단 헤더 */}
                    <View style={styles.header}>
                        <Pressable style={styles.iconButton} onPress={onClose}>
                            <X color="#999999" size={32} strokeWidth={2.5} />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.submitButton,
                                (!content.trim() || isPending) && { opacity: 0.5 },
                                pressed && { transform: [{ scale: 0.95 }] }
                            ]}
                            onPress={handleSubmit}
                            disabled={!content.trim() || isPending} // UX: 내용이 없으면 버튼 비활성화
                        >
                            <Text style={styles.submitButtonText}>투하하기</Text>
                        </Pressable>
                    </View>

                    {/* 위치 고정 뱃지 */}
                    <View style={styles.locationBadge}>
                        <MapPin color="#666666" size={16} strokeWidth={2.5} />
                        <Text style={styles.locationBadgeText}>현재 위치에 고정됨 (반경 50m)</Text>
                    </View>

                    {/* 입력 폼 */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={`무슨 일이 일어나고 있나요?\n솔직한 현장 상황을 알려주세요.`}
                            placeholderTextColor="#CCCCCC"
                            multiline
                            autoFocus={true}
                            maxLength={MAX_LENGTH}
                            value={content}
                            onChangeText={setContent}
                            editable={!isPending}
                        />
                        {/* [UX] 글자 수 인디케이터 추가 */}
                        <Text style={[
                            styles.charCount,
                            content.length >= MAX_LENGTH && styles.charCountLimit
                        ]}>
                            {content.length} / {MAX_LENGTH}
                        </Text>
                    </View>

                    {/* 하단 폭파 타이머 설정 */}
                    <View style={styles.timerSection}>
                        <View style={styles.timerHeader}>
                            <Timer color="#111111" size={18} strokeWidth={2.5} />
                            <Text style={styles.timerTitle}>폭파 타이머 (Time-Bomb)</Text>
                        </View>

                        <View style={styles.timerOptions}>
                            {([1, 12, 24] as const).map((hours) => {
                                const isSelected = ttlHours === hours;
                                return (
                                    <Pressable
                                        key={hours}
                                        style={[styles.timerOption, isSelected && styles.timerOptionSelected]}
                                        onPress={() => handleTtlSelect(hours)}
                                        disabled={isPending}
                                    >
                                        <Text style={[styles.timerOptionText, isSelected && styles.timerOptionTextSelected]}>
                                            {hours}시간
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        <Text style={styles.timerWarning}>
                            시간이 지나면 흔적 없이 완전히 삭제됩니다.
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 999,
        paddingHorizontal: 24,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconButton: {
        padding: 4,
    },
    submitButton: {
        backgroundColor: '#111111',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#EAEAEA'
    },
    locationBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666666',
    },
    inputContainer: {
        flex: 1,
    },
    textInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: '800',
        color: '#111111',
        textAlignVertical: 'top',
        lineHeight: 34,
        letterSpacing: -0.5
    },
    charCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999999',
        textAlign: 'right',
        marginTop: 8,
    },
    charCountLimit: {
        color: '#FF4444',
    },
    timerSection: {
        marginTop: 'auto',
        paddingTop: 16,
        paddingBottom: 8,
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    timerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111111',
    },
    timerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    timerOption: {
        flex: 1,
        paddingVertical: 16,
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        borderRadius: 16,
        alignItems: 'center',
    },
    timerOptionSelected: {
        backgroundColor: '#111111',
        borderColor: '#111111',
    },
    timerOptionText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666666',
    },
    timerOptionTextSelected: {
        color: '#FFFFFF',
    },
    timerWarning: {
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 12,
    }
});