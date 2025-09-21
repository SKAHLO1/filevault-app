import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { FilecoinClient } from "@/lib/filecoin-client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { datasetId, additionalDuration } = await request.json()

    if (!datasetId || !additionalDuration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const filecoinClient = new FilecoinClient()
    const success = await filecoinClient.renewDataset(datasetId, additionalDuration)

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Dataset renewed successfully",
      })
    } else {
      return NextResponse.json({ error: "Failed to renew dataset" }, { status: 500 })
    }
  } catch (error) {
    console.error("Renewal error:", error)
    return NextResponse.json({ error: "Failed to renew dataset" }, { status: 500 })
  }
}
