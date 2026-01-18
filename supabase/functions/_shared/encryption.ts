// AES-256-GCM encryption for tokens using Web Crypto API
// Uses a dedicated encryption key derived from the service role key

const ENCRYPTION_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Derive a proper 256-bit key from the service role key using PBKDF2
async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  // Use a fixed salt - in production, consider storing a random salt per-token
  const salt = encoder.encode('lovable-token-encryption-salt-v1');
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptToken(token: string): Promise<string> {
  if (!token || !ENCRYPTION_KEY) return '';
  
  try {
    const encoder = new TextEncoder();
    const key = await deriveKey();
    
    // Generate a random 12-byte IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(token)
    );
    
    // Combine IV + ciphertext and encode as base64
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Token encryption failed:', error);
    return '';
  }
}

export async function decryptToken(encryptedToken: string): Promise<string> {
  if (!encryptedToken || !ENCRYPTION_KEY) return '';
  
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedToken).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const key = await deriveKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // Try legacy XOR decryption for backward compatibility
    try {
      return decryptLegacyToken(encryptedToken);
    } catch {
      console.error('Token decryption failed:', error);
      return '';
    }
  }
}

// Legacy XOR decryption for backward compatibility with existing tokens
function decryptLegacyToken(encryptedToken: string): string {
  const encrypted = new Uint8Array(
    atob(encryptedToken).split('').map(c => c.charCodeAt(0))
  );
  
  const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY);
  const decrypted = new Uint8Array(encrypted.length);
  
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return new TextDecoder().decode(decrypted);
}
