/**
 * Complete API Service for NewsScope
 * Handles all backend communication including authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
}

// Authentication API
export const authApi = {
  async signup(name: string, email: string, password: string) {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email: string, password: string) {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return apiCall('/api/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser() {
    return apiCall('/api/auth/me');
  },

  async forgotPassword(email: string) {
    return apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string) {
    return apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// News Analysis API
export interface AnalyzeRequest {
  text: string;
  headline?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: {
    timestamp: string;
    headline: string;
    news_text: string;
    verdict: string;
    confidence: number;
    summary: string;
    detailed_analysis: string;
    red_flags: string[];
    verification_suggestions: string[];
    key_claims: string[];
    sources_checked: Array<{
      name: string;
      url: string;
      credibility: string;
      checked: boolean;
    }>;
    total_sources_checked: number;
    ai_model: string;
  };
  error?: string;
  message?: string;
}

export const newsApi = {
  async healthCheck() {
    return apiCall('/api/health');
  },

  async analyzeNews(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    return apiCall('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getSources() {
    return apiCall('/api/sources');
  },

  async sendFeedback(name: string, email: string, message: string) {
    return apiCall('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats() {
    return apiCall('/api/dashboard');
  },

  async getHistory(page: number = 1, perPage: number = 10) {
    return apiCall(`/api/history?page=${page}&per_page=${perPage}`);
  },

  async deleteAnalysis(analysisId: number) {
    return apiCall(`/api/history/${analysisId}`, {
      method: 'DELETE',
    });
  },

  async deleteAllAnalyses() {
    return apiCall('/api/history', {
      method: 'DELETE',
    });
  },
};

// Export all APIs
export default {
  auth: authApi,
  news: newsApi,
  dashboard: dashboardApi,
};