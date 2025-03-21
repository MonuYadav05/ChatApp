import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";

export default async function signup() {
    const session = await getServerSession(authOptions);
    if (session && session?.user?.id) {
        redirect("/home");
    }

    return <AuthForm type="signup" />;
} 