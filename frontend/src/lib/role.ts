import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface DecodedToken {
    sub: string; // User ID
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

export async function getUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token.value);
        return decoded.sub;
    } catch {
        return null;
    }
}

export async function getUserData(): Promise<DecodedToken | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");
    if (!token) return null;

    try {
        return jwtDecode<DecodedToken>(token.value);
    } catch {
        return null;
    }
}