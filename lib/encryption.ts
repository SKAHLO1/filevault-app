import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32

export async function encryptFile(data: Buffer, password: string): Promise<Buffer> {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256")
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([salt, iv, tag, encrypted])
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt file")
  }
}

export async function decryptFile(encryptedData: Buffer, password: string): Promise<Buffer> {
  try {
    const salt = encryptedData.subarray(0, SALT_LENGTH)
    const iv = encryptedData.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = encryptedData.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const encrypted = encryptedData.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const key = crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256")
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt file - invalid password or corrupted data")
  }
}

export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const saltBuffer = salt ? Buffer.from(salt, "hex") : crypto.randomBytes(32)
  const hash = crypto.pbkdf2Sync(password, saltBuffer, 100000, 64, "sha256")
  return {
    hash: hash.toString("hex"),
    salt: saltBuffer.toString("hex"),
  }
}
