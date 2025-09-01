import { type NextRequest, NextResponse } from "next/server"
import { FilecoinClient } from "@/lib/filecoin-client"
import { encryptFile } from "@/lib/encryption"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const encryptionKey = formData.get("encryptionKey") as string

    if (!file || !userId || !encryptionKey) {
      return NextResponse.json({ error: "Missing required fields: file, userId, or encryptionKey" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Encrypt the file
    const encryptedData = await encryptFile(buffer, encryptionKey)

    // Create file metadata
    const fileMetadata = {
      id: uuidv4(),
      originalName: file.name,
      size: file.size,
      type: file.type,
      userId,
      uploadedAt: new Date().toISOString(),
      encrypted: true,
    }

    // Upload to Filecoin
    const filecoinClient = new FilecoinClient()
    const uploadResult = await filecoinClient.uploadFile(encryptedData, fileMetadata)

    // Store metadata in database (simulated for now)
    const fileRecord = {
      ...fileMetadata,
      cid: uploadResult.cid,
      dealId: uploadResult.dealId,
      storageProviders: uploadResult.storageProviders,
      status: "uploaded",
    }

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: "File uploaded successfully to Filecoin",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file to Filecoin" }, { status: 500 })
  }
}
