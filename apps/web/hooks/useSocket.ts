"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";
import { useSession } from "next-auth/react";

export function useSocket() {
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {

            // @ts-ignore
            const token = session?.user?.jwtToken;
            const newSocket = new WebSocket(`${WS_URL}?token=${token}`);
            newSocket.onopen = () => {
                setLoading(false);
                setSocket(newSocket);
            };

            newSocket.onerror = () => {
                setLoading(false);
            };

            newSocket.onclose = () => {
                setLoading(false);
                setSocket(undefined);
            };
            return () => {
                newSocket.close();
            };
        }
    }, [session]);

    return { socket, loading }
}