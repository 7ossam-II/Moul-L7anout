export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const successResponse = <T>(
  data: T,
  message?: string,
  pagination?: ApiResponse['pagination']
): ApiResponse<T> => ({
  success: true,
  data,
  ...(message && { message }),
  ...(pagination && { pagination }),
});

export const errorResponse = (
  message: string,
  error?: string
): ApiResponse<never> => ({
  success: false,
  message,
  ...(error && { error }),
});