import { type NextRequest, NextResponse } from "next/server"
import { filecoinSynapse } from "@/lib/filecoin-synapse"
import { decryptFile } from "@/lib/encryption"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const encryptionKey = searchParams.get("encryptionKey")
    const fileName = searchParams.get("fileName") || "download"
    const fileType = searchParams.get("fileType") || "application/octet-stream"

    if (!encryptionKey) {
      return NextResponse.json({ error: "Missing encryptionKey parameter" }, { status: 400 })
    }

    const downloadedData = await filecoinSynapse.downloadFile(params.cid)

    if (!downloadedData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const encryptedBuffer = Buffer.from(downloadedData)
    const decryptedData = await decryptFile(encryptedBuffer, encryptionKey)

    return new NextResponse(decryptedData, {
      headers: {
        "Content-Type": fileType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": decryptedData.length.toString(),
      },
    })
  } catch (error) {
    console.error("Retrieve file error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve file from Filecoin" },
      { status: 500 }
    )
  }
}
