import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Signup from "../components/Signup";
import { redirect } from "next/navigation";



export default async function signup() {
    const session = await getServerSession(authOptions);
    if (session && session?.user?.id) {
        redirect("/home");
    }

    return <Signup />
} 