// src/utils/helpers.ts
// Fungsi-fungsi helper umum

/**
 * Mengubah string menjadi integer dengan nilai default
 */
export const toInt = (value: string | undefined, defaultValue: number): number => {
  const parsed = parseInt(value ?? '', 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Mengambil nilai pagination dari query string
 */
export const parsePagination = (
  pageStr?: string,
  limitStr?: string
): { page: number; limit: number; offset: number } => {
  const page = Math.max(1, toInt(pageStr, 1));
  const limit = Math.min(100, Math.max(1, toInt(limitStr, 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Membersihkan string dari karakter berbahaya (basic sanitization)
 */
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/[<>]/g, '');
};

/**
 * Mengecek apakah sebuah nilai adalah undefined atau null
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Format tanggal ke format Indonesia
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Validasi format email menggunakan regex standar RFC 5322 (simplified).
 * Gunakan ini di controller sebelum memproses data ke service/DB.
 *
 * @param email - String email yang akan divalidasi
 * @returns true jika format email valid, false jika tidak
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
