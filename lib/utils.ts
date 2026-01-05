// Generate a random 6-character alphanumeric code (e.g., CHKN22)
export function generateGroupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate US zip code (5 digits)
export function isValidZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

// Format price tier for display
export function formatPriceTier(tier: number): string {
  return '$'.repeat(tier);
}

// Copy text to clipboard (web-compatible)
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

// Trigger haptic feedback (web-compatible)
export function vibrate(duration: number = 50): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

// Get expiration time (24 hours from now)
export function getExpirationTime(): string {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  return expiresAt.toISOString();
}
