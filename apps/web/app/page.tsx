"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  return (
    <div className='flex justify-center items-center gap-5 h-[100vh] w-[100vw]'>
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
