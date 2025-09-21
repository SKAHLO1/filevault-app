import { type NextRequest, NextResponse } from "next/server"
import { FilecoinClient } from "@/lib/filecoin-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get("dealId")

    if (!dealId) {
      return NextResponse.json({ error: "Missing dealId parameter" }, { status: 400 })
    }

    const filecoinClient = new FilecoinClient()
    const dealStatus = await filecoinClient.getDealStatus(dealId)

    return NextResponse.json({
      success: true,
      dealId,
      status: dealStatus.status,
      storageProviders: dealStatus.storageProviders,
      expirationDate: dealStatus.expirationDate,
      replicationFactor: dealStatus.replicationFactor,
    })
  } catch (error) {
    console.error("Storage status error:", error)
    return NextResponse.json({ error: "Failed to get storage status" }, { status: 500 })
  }
}
