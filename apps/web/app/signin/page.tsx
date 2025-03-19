import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../lib/auth';
import { Signin } from '../components/Signin';

export default async function SigninPage() {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/');
    }
    return <Signin />;
};

