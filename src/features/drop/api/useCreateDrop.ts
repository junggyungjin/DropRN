import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDrop, CreateDropRequest } from "../../../entities/drop/api/dropApi";
import Toast from "react-native-toast-message";

export const useCreateDrop = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateDropRequest) => createDrop(params),
        onSuccess: () => {
            // 새 드롭이 생성되었으므로, 기존의 '주변 드롭 목록' 캐시를 무효화하여 즉시 재조회(새로고침) 유도
            queryClient.invalidateQueries({ queryKey: ['drops', 'nearby'] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: '드롭 생성 실패',
                text2: error.message || '다시 시도해 주세요.',
                position: 'top',
                visibilityTime: 2000,
            });
        }
    });
};