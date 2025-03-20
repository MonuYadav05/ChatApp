import { NextResponse } from "next/server";
import { NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: ['/home', '/room/:path*'],
    runtime: "nodejs",
};
const withAuth = async (req: NextRequestWithAuth) => {

    const token = await getToken({ req });
    if (!token) {
        return NextResponse.redirect(new URL("/invalidsession", req.url));
    }

    console.log("Token:", token.jwtToken);
    console.log("Token:", token);
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

    const user = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?token=` + token.jwtToken,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.jwtToken}`,
            },
        }
    );

    const json = await user.json();
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