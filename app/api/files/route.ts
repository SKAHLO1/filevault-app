import { type NextRequest, NextResponse } from "next/server"
import { FilecoinClient } from "@/lib/filecoin-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    // In a real app, this would query your database
    // For now, we'll simulate retrieving user files
    const filecoinClient = new FilecoinClient()
    const userFiles = await filecoinClient.getUserFiles(userId)

    return NextResponse.json({
      success: true,
      files: userFiles,
      count: userFiles.length,
    })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ error: "Failed to retrieve files" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")
    const userId = searchParams.get("userId")

    if (!fileId || !userId) {
      return NextResponse.json({ error: "Missing fileId or userId parameter" }, { status: 400 })
    }

    const filecoinClient = new FilecoinClient()
    await filecoinClient.deleteFile(fileId, userId)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
