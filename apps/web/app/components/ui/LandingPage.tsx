"use client"
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
const LandingPage = () => {
    const { data: session } = useSession();
    return (
        <div className='flex justify-center items-center gap-5 h-[100vh] w-[100vw]'>
            Landing Page
            {!session?.user && <button onClick={() => signIn()} className='border cursor-pointer p-2 rounded-md' >Signin</button>}
        </div>
    )
}

export default LandingPage