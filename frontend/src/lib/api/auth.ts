import { SigninPayload } from "@/types/auth-props"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function signinRequest(payload: SigninPayload) {
  if (!API_URL) throw new Error("API URL is not defined")

  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email?.toString().trim() ?? "",
      password: payload.password?.toString().trim() ?? "",
    }),
    credentials: "include",
  })

  const data = await res.json()
  return { ok: res.ok, data }
}
