export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
    success: boolean;
    timestamp: string;
    data?: T;
    error?: ApiError;
}