import { env } from '../config/env';
import { mockResponses } from './mockData';
import type { ApiResponse } from '../types/api.types';

// Define a more specific type for mock responses
type MockResponse<T = unknown> = ApiResponse<T> | ((data?: Record<string, unknown>) => ApiResponse<T>);

class ApiClient {
  private baseURL: string;
  private useMock: boolean;
  private mockDelay: number = 500;

  constructor() {
    this.baseURL = env.API_URL;
    this.useMock = env.USE_MOCK;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('moul_l7anout_token');
  }

  private async handleMockRequest<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
    
    // Clean endpoint for matching (remove query params)
    const cleanEndpoint = endpoint.split('?')[0];
    const key = `${method} ${cleanEndpoint}`;
    
    // Find mock response
    const mockResponse = mockResponses[key] as MockResponse<T> | undefined;
    
    if (mockResponse) {
      // Handle function responses
      if (typeof mockResponse === 'function') {
        // Extract params from URL if needed
        const params: Record<string, unknown> = { ...data };
        return mockResponse(params) as ApiResponse<T>;
      }
      
      console.log(`🎭 Mock API: ${method} ${endpoint}`, data);
      return mockResponse as ApiResponse<T>;
    }
    
    // Default response for unmocked endpoints
    console.warn(`⚠️ No mock found for: ${method} ${endpoint}`);
    return {
      success: true,
      data: {} as T,
      message: `Mock response for ${method} ${endpoint}`
    };
  }

  private async handleRealRequest<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
      });
      
      if (response.status === 401) {
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        const err = new Error(message) as Error & { details?: unknown[] };
        err.details = errorData.details ?? [];
        throw err;
      }
      
      return response.json() as Promise<ApiResponse<T>>;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    if (this.useMock) {
      return this.handleMockRequest<T>(method, endpoint, data);
    }
    return this.handleRealRequest<T>(method, endpoint, data);
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  // Helper method for file uploads
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    if (this.useMock) {
      console.log(`🎭 Mock Upload: ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, this.mockDelay));
      return {
        success: true,
        data: {
          url: 'https://via.placeholder.com/300',
          filename: 'mock-file.jpg',
          size: 1024
        } as T,
        message: 'Mock file uploaded successfully'
      };
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed! status: ${response.status}`);
      }
      
      return response.json() as Promise<ApiResponse<T>>;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export default for convenience
export default apiClient;