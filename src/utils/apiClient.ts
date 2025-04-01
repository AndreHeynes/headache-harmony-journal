
/**
 * Secure API Client
 * 
 * Foundation for secure API calls. This will be enhanced when Supabase is integrated.
 * Currently provides structure for making secure API calls with proper error handling.
 */

import { addCSRFTokenToHeaders } from './csrfProtection';

// API base URL - will be replaced with Supabase URL
const API_BASE_URL = '';

// Types for API responses
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Generic API request function with security measures
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // Add security headers
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    // Add CSRF protection
    const secureHeaders = addCSRFTokenToHeaders(headers);
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: secureHeaders,
      credentials: 'include', // Include cookies for auth when backend is implemented
    });
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Check if response was successful
    if (!response.ok) {
      return {
        error: data?.message || 'An error occurred',
        status: response.status
      };
    }
    
    return {
      data: data as T,
      status: response.status
    };
    
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: 'Network error - please try again',
      status: 0 // No status code for network errors
    };
  }
};

// API client with common HTTP methods
export const apiClient = {
  // GET request
  get: <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      ...options
    });
  },
  
  // POST request
  post: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  // PUT request
  put: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },
  
  // DELETE request
  delete: <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
};
