import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { FilecoinClient } from "@/lib/filecoin-client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const filecoinClient = new FilecoinClient()
    const userFiles = await filecoinClient.getUserFiles(session.user.id)

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
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId parameter" }, { status: 400 })
    }

    const filecoinClient = new FilecoinClient()
    await filecoinClient.deleteFile(fileId, session.user.id)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
