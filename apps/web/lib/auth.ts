import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import prisma from "@repo/db/client";
import { importJWK, SignJWT, JWTPayload } from "jose";
import { JWT_SECRET } from "@repo/backend-common/config"
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
const randomUUID = crypto.randomUUID;
export interface session extends Session {
    user: {
        id: string,
        name?: string,
        email: string,
        jwtToken: string,
    }
}

export interface token extends JWT {
    uid: string,
    jwtToken: string,
}

export interface user {
    id: string,
    name?: string,
    email: string,
    token: string,
}
// console.log(JWT_SECRET);
const generateJWT = async (payload: JWTPayload) => {
    const jwk = await importJWK({ alg: "HS256", k: Buffer.from(JWT_SECRET, "utf-8").toString("base64url"), kty: "oct" });

    const jwt = await new SignJWT({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: randomUUID(),
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(jwk);

    return jwt;
};


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { type: "email", label: "Email", placeholder: "Email" },
                password: { type: "password", label: "Password", placeholder: "Password" }
            },

            async authorize(credentials?: Record<"email" | "password", string>) {
                try {
                    if (!credentials) {
                        return null;
                    }
                    const { email, password } = credentials;
                    if (!email || !password) {
                        return null;
                    }

                    const userDb = await prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                        select: {
                            name: true,
                            id: true,
                            password: true,
                        }
                    });
                    if (userDb && userDb.password && await bcrypt.compare(password, userDb.password)) {
                        const jwt = await generateJWT({
                            id: userDb.id,
                        });
                        await prisma.user.update({
                            where: {
                                id: userDb.id
                            },
                            data: {
                                token: jwt,
                            }
                        });
                        return {
                            id: userDb.id,
                            name: userDb.name,
                            email: email,
                            token: jwt,
                        }

                    };
                    console.log("not in db");
                    return null;
                } catch (e) {
                    console.log(e)
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            const newSession: session = session as session;
            if (newSession.user && token.uid) {
                newSession.user.id = token.uid as string;
                newSession.user.jwtToken = token.jwtToken as string;
            }
            return newSession;
        },
        jwt: async ({ token, user }: { token: JWT, user: User }): Promise<JWT> => {
            const newToken: token = token as token;
            if (user) {
                newToken.uid = user.id;
                newToken.jwtToken = (user as user).token;
            }
            return newToken;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET || "secr3t"
} satisfies NextAuthOptions;