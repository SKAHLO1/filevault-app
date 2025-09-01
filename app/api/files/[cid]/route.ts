import { type NextRequest, NextResponse } from "next/server"
import { FilecoinClient } from "@/lib/filecoin-client"
import { decryptFile } from "@/lib/encryption"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const encryptionKey = searchParams.get("encryptionKey")

    if (!userId || !encryptionKey) {
      return NextResponse.json({ error: "Missing userId or encryptionKey parameter" }, { status: 400 })
    }

    const filecoinClient = new FilecoinClient()

    // Retrieve file from Filecoin
    const fileData = await filecoinClient.retrieveFile(params.cid, userId)

    if (!fileData) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 })
    }

    // Decrypt the file
    const decryptedData = await decryptFile(fileData.encryptedContent, encryptionKey)

    // Return the decrypted file
    return new NextResponse(decryptedData, {
      headers: {
        "Content-Type": fileData.metadata.type,
        "Content-Disposition": `attachment; filename="${fileData.metadata.originalName}"`,
        "Content-Length": decryptedData.length.toString(),
      },
    })
  } catch (error) {
    console.error("Retrieve file error:", error)
    return NextResponse.json({ error: "Failed to retrieve file from Filecoin" }, { status: 500 })
  }
}
