import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

const getUserDetails = async () => {
  const session = getServerSession(authOptions);
  return session;
}

export default async function Home() {
  const session = await getUserDetails();

  if (session?.user) {
    redirect("/home")
  }

  return <LandingPage />
}
