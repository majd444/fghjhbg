import crypto from 'crypto';

/**
 * Validates a webhook signature from Meta platforms (WhatsApp, Instagram, Messenger)
 * 
 * @param signature The signature provided in the X-Hub-Signature-256 header
 * @param body The raw request body as a string
 * @param appSecret The app secret from Meta developer portal
 * @returns boolean indicating if the signature is valid
 */
export function validateMetaSignature(signature: string | null, body: string, appSecret: string): boolean {
  if (!signature) return false;
  
  // Remove 'sha256=' prefix
  const receivedHash = signature.startsWith('sha256=') 
    ? signature.substring(7) 
    : signature;
  
  // Create the expected hash
  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(body)
    .digest('hex');
  
  // Compare in constant time to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(receivedHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}

/**
 * Validates a Discord webhook signature
 * 
 * @param signature The signature from the X-Signature-Ed25519 header
 * @param timestamp The timestamp from the X-Signature-Timestamp header
 * @param body The raw request body as a string
 * @param publicKey The Discord application public key
 * @returns boolean indicating if the signature is valid
 */
export function validateDiscordSignature(
  signature: string | null, 
  timestamp: string | null,
  body: string,
  publicKey: string
): boolean {
  if (!signature || !timestamp) return false;
  
  try {
    const nacl = require('tweetnacl');
    
    const timestampBody = timestamp + body;
    const signatureBytes = Buffer.from(signature, 'hex');
    const publicKeyBytes = Buffer.from(publicKey, 'hex');
    
    return nacl.sign.detached.verify(
      Buffer.from(timestampBody),
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Error validating Discord signature:', error);
    return false;
  }
}

/**
 * Validates a Telegram webhook by checking the token in the URL
 * 
 * @param path The request path
 * @param botToken The Telegram bot token
 * @returns boolean indicating if the request is valid
 */
export function validateTelegramWebhook(path: string, botToken: string): boolean {
  // Telegram webhook URLs are typically in the format:
  // /webhook/{botToken} or similar
  return path.includes(botToken);
}

/**
 * Encrypt sensitive data before storing
 * 
 * @param data The data to encrypt
 * @param encryptionKey The encryption key
 * @returns The encrypted data as a hex string
 */
export function encryptData(data: string, encryptionKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt data
 * 
 * @param encryptedData The encrypted data
 * @param encryptionKey The encryption key
 * @returns The decrypted data
 */
export function decryptData(encryptedData: string, encryptionKey: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
