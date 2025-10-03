import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { filecoinSynapse } from "@/lib/filecoin-synapse"
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

    if (!file || !encryptionKey) {
      return NextResponse.json({ error: "Missing required fields: file or encryptionKey" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const encryptedData = await encryptFile(buffer, encryptionKey)

    const uploadResult = await filecoinSynapse.uploadFile(encryptedData)

    const fileRecord = {
      id: uuidv4(),
      originalName: file.name,
      size: file.size,
      type: file.type,
      userId: session.user.id,
      uploadedAt: new Date().toISOString(),
      encrypted: true,
      pieceCid: uploadResult.pieceCid,
      pieceIds: uploadResult.pieceIds,
      status: "confirmed",
    }

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: "File uploaded successfully to Filecoin testnet",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file to Filecoin" },
      { status: 500 }
    )
  }
}
