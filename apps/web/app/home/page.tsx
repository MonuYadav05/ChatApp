"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
    const [slug, setSlug] = useState("");
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className='flex justify-center items-center gap-5 h-[100vh] w-[100vw]'>
            {session?.user && <div>{session?.user?.name} email -{session?.user?.email}</div>}
            <button onClick={() => signOut({
                callbackUrl: '/signin'
            })} className="cursor-pointer">SignOut</button>
            <input style={{
                "padding": "10px"
            }} className="mx-6 border border-b-amber-50 rounded-xl p-20" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="enter room name" />
            <button style={{
                "padding": "10px"
            }}
                className=" border-amber-50 border rounded-2xl p-10 cursor-pointer" onClick={() => {
                    router.push(`/room/${slug}`)
                }}>Join Room</button>
        </div>
    );
}
