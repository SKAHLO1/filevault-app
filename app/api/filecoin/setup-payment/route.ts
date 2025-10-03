import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { filecoinSynapse } from "@/lib/filecoin-synapse"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { depositAmount, rateAllowance, lockupAllowance, maxLockupPeriod } = await request.json()

    if (!depositAmount || !rateAllowance || !lockupAllowance) {
      return NextResponse.json(
        { error: "Missing required fields: depositAmount, rateAllowance, lockupAllowance" },
        { status: 400 }
      )
    }

    await filecoinSynapse.depositUSDFC(depositAmount)

    await filecoinSynapse.approveWarmStorageService(
      rateAllowance,
      lockupAllowance,
      maxLockupPeriod ? BigInt(maxLockupPeriod) : 86400n
    )

    return NextResponse.json({
      success: true,
      message: "Payment setup completed successfully",
    })
  } catch (error) {
    console.error("Payment setup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to setup payment" },
      { status: 500 }
    )
  }
}
