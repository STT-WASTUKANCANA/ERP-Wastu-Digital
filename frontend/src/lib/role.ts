import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface DecodedToken {
  role_id: number;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export function getUserRoleId(): number | null {
  const token = cookies().get("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token.value);
    return decoded.role_id;
  } catch {
    return null;
  }
}