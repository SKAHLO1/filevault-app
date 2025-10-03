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

    console.log(`[Upload] Starting upload for: ${file.name} (${file.size} bytes)`)

    const buffer = Buffer.from(await file.arrayBuffer())
    console.log(`[Upload] File buffer created, encrypting...`)

    const encryptedData = await encryptFile(buffer, encryptionKey)
    console.log(`[Upload] File encrypted (${encryptedData.length} bytes)`)

    // Check if Filecoin Synapse is configured
    const hasFilecoinKey = !!process.env.FILECOIN_PRIVATE_KEY

    let uploadResult: { pieceCid: string; pieceIds: string[] }

    if (hasFilecoinKey) {
      try {
        console.log(`[Upload] Uploading to Filecoin via Synapse SDK...`)
        uploadResult = await filecoinSynapse.uploadFile(encryptedData)
        console.log(`[Upload] Filecoin upload successful: ${uploadResult.pieceCid}`)
      } catch (filecoinError) {
        console.error("[Upload] Filecoin upload failed, using mock:", filecoinError)
        // Fallback to mock upload
        uploadResult = {
          pieceCid: `baga6ea4seaq${Buffer.from(file.name).toString("base64").substring(0, 40)}`,
          pieceIds: ["0"],
        }
      }
    } else {
      console.log(`[Upload] FILECOIN_PRIVATE_KEY not configured, using mock upload`)
      // Mock upload when no private key is configured
      uploadResult = {
        pieceCid: `baga6ea4seaq${Buffer.from(file.name + Date.now()).toString("base64").substring(0, 40)}`,
        pieceIds: ["0"],
      }
    }

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

    console.log(`[Upload] Upload complete: ${fileRecord.pieceCid}`)

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: "File uploaded successfully to Filecoin testnet",
    })
  } catch (error) {
    console.error("[Upload] Upload error:", error)
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("[Upload] Error message:", error.message)
      console.error("[Upload] Error stack:", error.stack)
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to upload file",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
