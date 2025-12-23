/**
 * API Service for NewsScope Backend
 * Connects frontend to Flask backend
 */

// VITE_API_URL is provided by Vite's ImportMetaEnv type; no need to redeclare ImportMeta or ImportMetaEnv here.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export interface SourcesResponse {
  success: boolean;
  total_sources: number;
  sources: Array<{
    name: string;
    url: string;
    credibility: string;
    checked: boolean;
  }>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  gemini_api_configured: boolean;
}

class NewsApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the backend is healthy and running
   */
  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (!response.ok) {
        throw new Error('Backend is not responding');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to connect to backend: ${error}`);
    }
  }

  /**
   * Analyze a news article for fake news detection
   */
  async analyzeNews(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Analysis failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze news');
    }
  }

  /**
   * Get list of sources checked by the system
   */
  async getSources(): Promise<SourcesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sources`);
      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch sources: ${error}`);
    }
  }

  /**
   * Analyze multiple articles at once
   */
  async batchAnalyze(articles: AnalyzeRequest[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/batch-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articles }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Batch analysis failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to perform batch analysis');
    }
  }
}

// Export singleton instance
export const newsApi = new NewsApiService();

// Export class for custom instances
export default NewsApiService;
