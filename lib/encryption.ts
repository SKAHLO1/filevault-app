import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32

export async function encryptFile(data: Buffer, password: string): Promise<Buffer> {
  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)

    // Derive key from password using PBKDF2
    const key = crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256")

    // Create cipher
    const cipher = crypto.createCipherGCM(ALGORITHM, key, iv)

    // Encrypt the data
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    const tag = cipher.getAuthTag()

    // Combine salt + iv + tag + encrypted data
    return Buffer.concat([salt, iv, tag, encrypted])
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt file")
  }
}

export async function decryptFile(encryptedData: Buffer, password: string): Promise<Buffer> {
  try {
    // Extract components
    const salt = encryptedData.subarray(0, SALT_LENGTH)
    const iv = encryptedData.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = encryptedData.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const encrypted = encryptedData.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

    // Derive key from password
    const key = crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha256")

    // Create decipher
    const decipher = crypto.createDecipherGCM(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    // Decrypt the data
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
