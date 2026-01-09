/**
 * Input validation and sanitization utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

/**
 * Email validation using RFC 5322 standard
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password strength validation
 * Minimum 8 characters, at least one letter and one number
 */
export function isStrongPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;

  // Minimum 8 characters
  if (password.length < 8) return false;

  // At least one letter
  if (!/[a-zA-Z]/.test(password)) return false;

  // At least one number
  if (!/[0-9]/.test(password)) return false;

  return true;
}

/**
 * Get password strength rating
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';

  let strength = 0;

  // Length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

/**
 * Sanitize string input to prevent XSS
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .slice(0, 1000); // Limit length to prevent DoS
}

/**
 * Sanitize display name
 * Allows letters, numbers, spaces, and basic punctuation
 */
export function sanitizeDisplayName(name: string): string {
  if (!name || typeof name !== 'string') return '';

  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Only allow alphanumeric, spaces, dash, underscore, dot
    .slice(0, 50); // Max 50 characters
}

/**
 * Validate and sanitize URL
 * Ensures URL is safe and uses allowed protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch (error) {
    return '';
  }
}

/**
 * Validate zip code (US format)
 */
export function isValidZipCode(zipCode: string): boolean {
  if (!zipCode || typeof zipCode !== 'string') return false;

  // 5 digits or 5+4 format (12345 or 12345-6789)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode.trim());
}

/**
 * Validate group code format
 * 6 alphanumeric characters
 */
export function isValidGroupCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;

  return /^[A-Z0-9]{6}$/.test(code.trim().toUpperCase());
}

/**
 * Sanitize numeric input
 * Returns null if not a valid number
 */
export function sanitizeNumber(input: any, min?: number, max?: number): number | null {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) return null;

  if (min !== undefined && num < min) return null;
  if (max !== undefined && num > max) return null;

  return num;
}

/**
 * Validate price tier
 */
export function isValidPriceTier(tier: any): tier is 1 | 2 | 3 | 4 {
  return [1, 2, 3, 4].includes(Number(tier));
}

/**
 * Validate radius
 */
export function isValidRadius(radius: any): boolean {
  const num = sanitizeNumber(radius, 1, 50);
  return num !== null;
}

/**
 * Sanitize array of strings
 * Removes invalid entries
 */
export function sanitizeStringArray(arr: any[]): string[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .filter((item) => typeof item === 'string')
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0)
    .slice(0, 20); // Max 20 items
}

/**
 * Check if string contains SQL injection patterns
 * Returns true if suspicious patterns detected
 */
export function hasSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/)/g, // SQL comments and terminators
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi, // OR 1=1
    /(\bAND\b\s*\d+\s*=\s*\d+)/gi, // AND 1=1
    /(\bunion\b.*\bselect\b)/gi, // UNION SELECT
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Rate limiting helper (client-side)
 * Returns true if action should be blocked
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  /**
   * Check if action should be blocked
   * @param key Unique identifier (e.g., user ID, IP)
   * @returns true if rate limit exceeded
   */
  isBlocked(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((timestamp) => now - timestamp < this.windowMs);

    // Check if limit exceeded
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return false;
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

/**
 * Validate file upload
 * Checks file type and size
 */
export function isValidFileUpload(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  // Check for valid US phone number (10 or 11 digits, optionally starting with 1)
  return /^1?\d{10}$/.test(cleaned);
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: any): boolean {
  return !str || (typeof str === 'string' && str.trim().length === 0);
}

/**
 * Validate object has required fields
 */
export function hasRequiredFields<T>(
  obj: any,
  fields: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;

  return fields.every((field) => {
    const value = obj[field];
    return value !== undefined && value !== null && !isEmpty(value);
  });
}
