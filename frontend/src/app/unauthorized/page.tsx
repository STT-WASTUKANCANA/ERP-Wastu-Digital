'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();

    useEffect(() => {
        // Attempt to go back immediately
        router.back();

        // Fallback to overview if back navigation doesn't happen quickly
        // (e.g., opened in new tab or no history)
        const timeout = setTimeout(() => {
            router.replace('/workspace/overview');
        }, 500);

        return () => clearTimeout(timeout);
    }, [router]);

    return null;
}
