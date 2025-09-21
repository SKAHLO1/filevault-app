import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export function requireAuth() {
  return async (req: Request) => {
    const session = await getSession()

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    return session
  }
}
