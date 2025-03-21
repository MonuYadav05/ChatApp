import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { authOptions } from '../../lib/auth';
import { AuthForm } from '../../components/AuthForm';

export default async function SigninPage() {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/');
    }
    return <AuthForm type="signin" />;
};

