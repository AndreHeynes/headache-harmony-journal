// Simple token encryption using AES-like approach with environment secret
// In production, consider using Supabase Vault for more robust encryption

const ENCRYPTION_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export function encryptToken(token: string): string {
  if (!token) return '';
  
  // Create a simple XOR-based encryption with base64 encoding
  const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
  const tokenBytes = new TextEncoder().encode(token);
  const encrypted = new Uint8Array(tokenBytes.length);
  
  for (let i = 0; i < tokenBytes.length; i++) {
    encrypted[i] = tokenBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  // Convert to base64 for storage
  return btoa(String.fromCharCode(...encrypted));
}

export function decryptToken(encryptedToken: string): string {
  if (!encryptedToken) return '';
  
  try {
    // Decode from base64
    const encrypted = new Uint8Array(
      atob(encryptedToken).split('').map(c => c.charCodeAt(0))
    );
    
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
    const decrypted = new Uint8Array(encrypted.length);
    
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Token decryption failed:', error);
    return '';
  }
}
