import { NextResponse } from "next/server";
import { NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: ['/room/:path*'],
    runtime: "nodejs",
};
const withAuth = async (req: NextRequestWithAuth) => {
    const token = await getToken({ req });

    // console.log("TOKENNEND", token)
    // console.log("Token:", token?.jwtToken);
    // console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    // console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    // console.log("SECRET", process.env.NEXTAUTH_SECRET);

    if (!token) {
        console.log("in token");
        return NextResponse.redirect(new URL("/invalidsession", req.url));
    }

   

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?token=` + token.jwtToken,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.jwtToken}`,
            },
        }
    );
    if (!res.ok) {
        console.log("in !res.ok");

        return NextResponse.redirect(new URL("/invalidsession", req.url));
    }

    const json = await res.json();

    if (!json.user) {
        return NextResponse.redirect(new URL("/invalidsession", req.url));
    }

    return NextResponse.next();

}
export async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    console.log(pathname);


    // console.log("hello", pathname.startsWith("/api"));
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }
    return await withAuth(req);
}

export default withAuth;