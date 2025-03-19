"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { useSession } from "next-auth/react";

export function useSocket() {
    const [socket, setSocket] = useState<WebSocket>();
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        // if (status !== "authenticated" || !session?.user?.) {
        //     return;
        // }
        const newSocket = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NTkzODBhMi1hNDlmLTQ2OTctYTFlMC1iMDFjMDQ5ZDg0MjUiLCJpYXQiOjE3NDA2NjU5MjJ9.EbcmUNTM7nWHNYtOJKGpEl2NVPuDR31ZOh8_eJMQxZA`)
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
    }, []);

    return { socket, loading }
}