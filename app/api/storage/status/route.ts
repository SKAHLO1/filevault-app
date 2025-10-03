import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get("dealId")

    if (!dealId) {
      return NextResponse.json({ error: "Missing dealId parameter" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      dealId,
      status: "active",
      storageProviders: [],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      replicationFactor: 1,
    })
  } catch (error) {
    console.error("Storage status error:", error)
    return NextResponse.json({ error: "Failed to get storage status" }, { status: 500 })
  }
}
