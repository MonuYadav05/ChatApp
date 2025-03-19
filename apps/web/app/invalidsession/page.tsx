"use client"

import { signOut } from "next-auth/react"
import { useEffect } from "react"

const invalidsession = () => {
    useEffect(() => {
        (async () => {
            signOut({
                callbackUrl: "/signin"
            })
        })()
    }, []);

    return <div>Loading...</div>
}

export default invalidsession;