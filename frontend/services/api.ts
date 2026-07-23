// frontend/services/api.ts
// Base API service - konfigurasi dasar untuk semua HTTP request

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Mendapatkan token JWT dari localStorage.
 * Hanya bisa dijalankan di sisi client (browser).
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Fungsi fetch dasar dengan penanganan error dan auto-inject Authorization header.
 * Token JWT diambil otomatis dari localStorage jika tersedia.
 */
async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Tambahkan query parameters jika ada
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Auto-inject Authorization header jika token tersedia
  const token = getAuthToken();
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      // Header manual dari caller dapat override header di atas jika diperlukan
      ...(fetchOptions.headers as Record<string, string> | undefined),
    },
    ...fetchOptions,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? `HTTP error! status: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

// ─── HTTP Methods ────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
