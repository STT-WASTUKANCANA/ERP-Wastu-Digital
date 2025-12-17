import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface DecodedToken {
    role_id: number;
    email: string;
    name: string;
    exp: number;
    iat: number;
}

export async function getUserRoleId(): Promise<number | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token.value);
        return decoded.role_id;
    } catch {
        return null;
    }
}