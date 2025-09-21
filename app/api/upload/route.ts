import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { FilecoinClient } from "@/lib/filecoin-client"
import { encryptFile } from "@/lib/encryption"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const encryptionKey = formData.get("encryptionKey") as string
    const duration = Number.parseInt(formData.get("duration") as string) || 365 * 24 * 3600 // Default 1 year
    const replicationFactor = Number.parseInt(formData.get("replicationFactor") as string) || 3

    if (!file || !encryptionKey) {
      return NextResponse.json({ error: "Missing required fields: file or encryptionKey" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const encryptedData = await encryptFile(buffer, encryptionKey)

    const fileMetadata = {
      id: uuidv4(),
      originalName: file.name,
      size: file.size,
      type: file.type,
      userId: session.user.id,
      uploadedAt: new Date().toISOString(),
      encrypted: true,
      duration,
      replicationFactor,
    }

    const filecoinClient = new FilecoinClient()
    const uploadResult = await filecoinClient.uploadFile(encryptedData, fileMetadata)

    const fileRecord = {
      ...fileMetadata,
      cid: uploadResult.cid,
      datasetId: uploadResult.datasetId,
      storageProviders: uploadResult.storageProviders,
      status: "pending",
    }

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: "File uploaded successfully to Filecoin with smart contract integration",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file to Filecoin" }, { status: 500 })
  }
}
