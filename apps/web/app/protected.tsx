"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem("token");
        if (!jwt) {
            if (!pathname.startsWith("/signup")) {
                setIsLoading(false);

                router.replace("/signin");
            }
            setIsLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(jwt);
            const isExpired = decoded.exp && decoded.exp < Date.now() / 1000;
            if (isExpired) {
                localStorage.removeItem("token");
                router.replace("/signin");
                setIsLoading(false);

                return;
            }

            if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
                router.replace("/");
                setIsLoading(false);

                return;
            }
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
            router.replace("/signin");
            setIsLoading(false);

            return;
        } finally {
            setIsLoading(false);
        }
    }, [pathname, router]);

    if (isLoading) {
        return <>Loading ..</>; // Or a loading spinner
    }

    return <>{children}</>;
}